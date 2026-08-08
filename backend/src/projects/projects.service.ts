import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';

import { Task, TaskDocument } from '../tasks/schemas/task.schema';

@Injectable()
export class ProjectsService implements OnModuleInit {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async onModuleInit() {
    // Initialization hook
  }

  async findAll(): Promise<any[]> {
    const dbProjects = await this.projectModel.find().sort({ createdAt: -1 }).exec();
    return Promise.all(
      dbProjects.map(async p => {
        const count = await this.taskModel.countDocuments({
          $or: [
            { project: p._id.toString() },
            { project: p.name },
            { project: { $regex: p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
          ]
        });

        return {
          id: p._id.toString(),
          name: p.name,
          priority: p.priority,
          status: p.status || 'IN_PROGRESS',
          leadName: p.leadName,
          leadAvatar: p.leadAvatar,
          tasksCount: count,
          createdAt: (p as any).createdAt
            ? new Date((p as any).createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            : '',
        };
      })
    );
  }

  async create(dto: CreateProjectDto): Promise<any> {
    const newProj = new this.projectModel(dto);
    const saved = await newProj.save();
    return {
      id: saved._id.toString(),
      name: saved.name,
      priority: saved.priority,
      status: saved.status || 'IN_PROGRESS',
      leadName: saved.leadName,
      leadAvatar: saved.leadAvatar,
      tasksCount: saved.tasksCount || 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
  }

  async update(id: string, dto: Partial<CreateProjectDto>): Promise<any> {
    let updated = null;
    if (isValidObjectId(id)) {
      updated = await this.projectModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    } else {
      updated = await this.projectModel.findOneAndUpdate({ name: id }, dto, { new: true }).exec();
    }

    if (!updated) return null;

    return {
      id: updated._id.toString(),
      name: updated.name,
      priority: updated.priority,
      status: updated.status || 'IN_PROGRESS',
      leadName: updated.leadName,
      leadAvatar: updated.leadAvatar,
      tasksCount: updated.tasksCount || 0,
      createdAt: (updated as any).createdAt
        ? new Date((updated as any).createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : '',
    };
  }

  async remove(id: string): Promise<boolean> {
    if (isValidObjectId(id)) {
      await this.projectModel.findByIdAndDelete(id).exec();
    } else {
      await this.projectModel.deleteOne({ name: id }).exec();
    }
    return true;
  }
}

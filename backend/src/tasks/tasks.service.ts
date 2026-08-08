import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService implements OnModuleInit {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async onModuleInit() {
    // Initialization hook
  }

  async findAll(query: any): Promise<Task[]> {
    const conditions: any[] = [];

    if (query.status) {
      conditions.push({ status: query.status.toUpperCase() });
    }
    if (query.priority) {
      conditions.push({ priority: query.priority.toUpperCase() });
    }
    if (query.project) {
      const escapedProject = query.project.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      conditions.push({
        $or: [
          { project: query.project },
          { project: { $regex: escapedProject, $options: 'i' } }
        ]
      });
    }
    if (query.search) {
      const escapedSearch = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      conditions.push({
        $or: [
          { title: { $regex: escapedSearch, $options: 'i' } },
          { description: { $regex: escapedSearch, $options: 'i' } }
        ]
      });
    }

    const filter = conditions.length > 0 ? { $and: conditions } : {};
    return this.taskModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Task | null> {
    return this.taskModel.findById(id).exec();
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = new this.taskModel(createTaskDto);
    return newTask.save();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const existingTask = await this.taskModel.findById(id);
    if (!existingTask) return null;

    const activityLogs = existingTask.activityLogs || [];
    if (updateTaskDto.priority && updateTaskDto.priority !== existingTask.priority) {
      activityLogs.unshift({
        id: `al-${Date.now()}`,
        text: `You changed priority from ${existingTask.priority} to ${updateTaskDto.priority}`,
        timestamp: new Date().toISOString()
      });
    }
    if (updateTaskDto.status && updateTaskDto.status !== existingTask.status) {
      activityLogs.unshift({
        id: `al-${Date.now()}`,
        text: `You changed status from ${existingTask.status} to ${updateTaskDto.status}`,
        timestamp: new Date().toISOString()
      });
    }

    return this.taskModel.findByIdAndUpdate(
      id,
      { ...updateTaskDto, activityLogs },
      { new: true }
    ).exec();
  }

  async remove(id: string): Promise<any> {
    return this.taskModel.findByIdAndDelete(id).exec();
  }

  async addSubtask(taskId: string, subtaskData: any): Promise<Task | null> {
    const newSubtask = {
      id: `st-${Date.now()}`,
      title: subtaskData.title,
      priority: subtaskData.priority || 'NO_PRIORITY',
      members: subtaskData.members || [],
      dueDate: subtaskData.dueDate || new Date().toISOString().split('T')[0],
      completed: false
    };

    return this.taskModel.findByIdAndUpdate(
      taskId,
      { $push: { subtasks: newSubtask } },
      { new: true }
    ).exec();
  }

  async addComment(taskId: string, commentData: any): Promise<Task | null> {
    const newComment = {
      id: `c-${Date.now()}`,
      authorName: commentData.authorName || 'User',
      authorAvatar: commentData.authorAvatar || '',
      content: commentData.content,
      attachments: commentData.attachments || [],
      createdAt: new Date().toISOString()
    };

    const newLog = {
      id: `al-${Date.now()}`,
      text: `You posted an update`,
      timestamp: new Date().toISOString()
    };

    return this.taskModel.findByIdAndUpdate(
      taskId,
      { 
        $push: { 
          comments: newComment,
          activityLogs: { $each: [newLog], $position: 0 }
        } 
      },
      { new: true }
    ).exec();
  }

  async removeSubtask(taskId: string, subtaskId: string): Promise<Task | null> {
    const task = await this.taskModel.findById(taskId);
    if (!task) return null;

    const filteredSubtasks = (task.subtasks || []).filter((st: any) => {
      const currentId = String(st.id || st._id || '');
      return currentId !== String(subtaskId);
    });

    return this.taskModel.findByIdAndUpdate(
      taskId,
      { $set: { subtasks: filteredSubtasks } },
      { new: true }
    ).exec();
  }
}

import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService implements OnModuleInit {
    private taskModel;
    constructor(taskModel: Model<TaskDocument>);
    onModuleInit(): Promise<void>;
    findAll(query: any): Promise<Task[]>;
    findOne(id: string): Promise<Task | null>;
    create(createTaskDto: CreateTaskDto): Promise<Task>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null>;
    remove(id: string): Promise<any>;
    addSubtask(taskId: string, subtaskData: any): Promise<Task | null>;
    addComment(taskId: string, commentData: any): Promise<Task | null>;
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const task_schema_1 = require("./schemas/task.schema");
let TasksService = class TasksService {
    constructor(taskModel) {
        this.taskModel = taskModel;
    }
    async onModuleInit() {
    }
    async findAll(query) {
        const filter = {};
        if (query.status) {
            filter.status = query.status.toUpperCase();
        }
        if (query.priority) {
            filter.priority = query.priority.toUpperCase();
        }
        if (query.project) {
            const escapedProject = query.project.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.$or = [
                { project: query.project },
                { project: { $regex: escapedProject, $options: 'i' } }
            ];
        }
        if (query.search) {
            filter.$or = [
                { title: { $regex: query.search, $options: 'i' } },
                { description: { $regex: query.search, $options: 'i' } }
            ];
        }
        return this.taskModel.find(filter).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        return this.taskModel.findById(id).exec();
    }
    async create(createTaskDto) {
        const newTask = new this.taskModel(createTaskDto);
        return newTask.save();
    }
    async update(id, updateTaskDto) {
        const existingTask = await this.taskModel.findById(id);
        if (!existingTask)
            return null;
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
        return this.taskModel.findByIdAndUpdate(id, { ...updateTaskDto, activityLogs }, { new: true }).exec();
    }
    async remove(id) {
        return this.taskModel.findByIdAndDelete(id).exec();
    }
    async addSubtask(taskId, subtaskData) {
        const newSubtask = {
            id: `st-${Date.now()}`,
            title: subtaskData.title,
            priority: subtaskData.priority || 'NO_PRIORITY',
            members: subtaskData.members || [],
            dueDate: subtaskData.dueDate || new Date().toISOString().split('T')[0],
            completed: false
        };
        return this.taskModel.findByIdAndUpdate(taskId, { $push: { subtasks: newSubtask } }, { new: true }).exec();
    }
    async addComment(taskId, commentData) {
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
        return this.taskModel.findByIdAndUpdate(taskId, {
            $push: {
                comments: newComment,
                activityLogs: { $each: [newLog], $position: 0 }
            }
        }, { new: true }).exec();
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TasksService);
//# sourceMappingURL=tasks.service.js.map
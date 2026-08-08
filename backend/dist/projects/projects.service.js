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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_schema_1 = require("./schemas/project.schema");
let ProjectsService = class ProjectsService {
    constructor(projectModel) {
        this.projectModel = projectModel;
    }
    async onModuleInit() {
    }
    async findAll() {
        const dbProjects = await this.projectModel.find().sort({ createdAt: -1 }).exec();
        return dbProjects.map(p => ({
            id: p._id.toString(),
            name: p.name,
            priority: p.priority,
            status: p.status || 'IN_PROGRESS',
            leadName: p.leadName,
            leadAvatar: p.leadAvatar,
            tasksCount: p.tasksCount || 0,
            createdAt: p.createdAt
                ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : '',
        }));
    }
    async create(dto) {
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
    async update(id, dto) {
        let updated = null;
        if ((0, mongoose_2.isValidObjectId)(id)) {
            updated = await this.projectModel.findByIdAndUpdate(id, dto, { new: true }).exec();
        }
        else {
            updated = await this.projectModel.findOneAndUpdate({ name: id }, dto, { new: true }).exec();
        }
        if (!updated)
            return null;
        return {
            id: updated._id.toString(),
            name: updated.name,
            priority: updated.priority,
            status: updated.status || 'IN_PROGRESS',
            leadName: updated.leadName,
            leadAvatar: updated.leadAvatar,
            tasksCount: updated.tasksCount || 0,
            createdAt: updated.createdAt
                ? new Date(updated.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : '',
        };
    }
    async remove(id) {
        if ((0, mongoose_2.isValidObjectId)(id)) {
            await this.projectModel.findByIdAndDelete(id).exec();
        }
        else {
            await this.projectModel.deleteOne({ name: id }).exec();
        }
        return true;
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map
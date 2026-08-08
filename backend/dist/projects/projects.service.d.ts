import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
export declare class ProjectsService implements OnModuleInit {
    private projectModel;
    constructor(projectModel: Model<ProjectDocument>);
    onModuleInit(): Promise<void>;
    findAll(): Promise<any[]>;
    create(dto: CreateProjectDto): Promise<any>;
    update(id: string, dto: Partial<CreateProjectDto>): Promise<any>;
    remove(id: string): Promise<boolean>;
}

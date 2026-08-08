import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(): Promise<any[]>;
    create(createProjectDto: CreateProjectDto): Promise<any>;
    update(id: string, updateDto: Partial<CreateProjectDto>): Promise<any>;
    remove(id: string): Promise<boolean>;
}

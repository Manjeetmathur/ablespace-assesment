import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(query: any): Promise<import("./schemas/task.schema").Task[]>;
    findOne(id: string): Promise<import("./schemas/task.schema").Task>;
    create(createTaskDto: CreateTaskDto): Promise<import("./schemas/task.schema").Task>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<import("./schemas/task.schema").Task>;
    remove(id: string): Promise<any>;
    addSubtask(id: string, body: any): Promise<import("./schemas/task.schema").Task>;
    addComment(id: string, body: any): Promise<import("./schemas/task.schema").Task>;
}

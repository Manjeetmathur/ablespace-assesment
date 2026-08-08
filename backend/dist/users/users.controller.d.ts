import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(): Promise<import("./schemas/user.schema").User>;
    updateProfile(body: any): Promise<import("./schemas/user.schema").User>;
    leaveWorkspace(): Promise<{
        success: boolean;
    }>;
}

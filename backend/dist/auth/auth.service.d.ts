import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly usersService;
    constructor(usersService: UsersService);
    continueAsGuest(): Promise<{
        statusCode: number;
        message: string;
        token: string;
        user: import("../users/schemas/user.schema").User;
    }>;
    login(email: string, password?: string): Promise<{
        statusCode: number;
        message: string;
        token: string;
        user: import("../users/schemas/user.schema").User;
    }>;
    register(name: string, email: string, password?: string): Promise<{
        statusCode: number;
        message: string;
        token: string;
        user: import("../users/schemas/user.schema").User;
    }>;
    googleLogin(payload: {
        credential?: string;
        accessToken?: string;
        email?: string;
        name?: string;
        avatar?: string;
        googleId?: string;
    }): Promise<{
        statusCode: number;
        message: string;
        token: string;
        user: import("../users/schemas/user.schema").User;
    }>;
}

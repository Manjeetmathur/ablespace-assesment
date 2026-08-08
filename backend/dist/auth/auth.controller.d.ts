import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    continueAsGuest(): Promise<{
        statusCode: number;
        message: string;
        token: string;
        user: import("../users/schemas/user.schema").User;
    }>;
    login(body: {
        email: string;
        password?: string;
    }): Promise<{
        statusCode: number;
        message: string;
        token: string;
        user: import("../users/schemas/user.schema").User;
    }>;
    register(body: {
        name: string;
        email: string;
        password?: string;
    }): Promise<{
        statusCode: number;
        message: string;
        token: string;
        user: import("../users/schemas/user.schema").User;
    }>;
    googleLogin(body: {
        credential?: string;
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

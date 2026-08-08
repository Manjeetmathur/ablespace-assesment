import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
export declare class UsersService implements OnModuleInit {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    onModuleInit(): Promise<void>;
    createGuestUser(): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findOrCreateGoogleUser(email: string, name: string, avatar?: string, googleId?: string): Promise<User>;
    createRealUser(name: string, email: string): Promise<User>;
    getProfile(): Promise<User>;
    updateProfile(updateData: Partial<User>): Promise<User | null>;
    resetWorkspace(): Promise<{
        success: boolean;
    }>;
}

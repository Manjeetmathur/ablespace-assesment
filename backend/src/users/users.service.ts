import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async onModuleInit() {
    // Initialization hook
  }

  async createGuestUser(): Promise<User> {
    return await this.userModel.create({
      name: 'Guest User',
      email: '',
      username: '',
      title: '',
      avatar: '',
      isGuest: true,
      theme: 'light',
      colorMode: 'blue',
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findOrCreateGoogleUser(
    email: string,
    name: string,
    avatar?: string,
    googleId?: string,
  ): Promise<User> {
    let user = await this.userModel.findOne({
      $or: [{ email }, { googleId: googleId || 'non-existent-id' }],
    }).exec();

    const username = email.split('@')[0];

    if (user) {
      user.name = name || user.name;
      if (avatar) user.avatar = avatar;
      if (googleId) user.googleId = googleId;
      user.isGuest = false;
      return await user.save();
    }

    return await this.userModel.create({
      name,
      email,
      username,
      title: 'Team Member',
      avatar: avatar || '',
      isGuest: false,
      theme: 'light',
      colorMode: 'blue',
      googleId,
    });
  }

  async createRealUser(name: string, email: string): Promise<User> {
    const username = email.split('@')[0];
    return await this.userModel.create({
      name,
      email,
      username,
      title: 'Team Member',
      avatar: '',
      isGuest: false,
      theme: 'light',
      colorMode: 'blue',
    });
  }

  async getProfile(): Promise<User> {
    let user = await this.userModel.findOne().exec();
    if (!user) {
      user = await this.userModel.create({
        name: '',
        email: '',
        username: '',
        title: '',
        avatar: '',
        isGuest: true,
        theme: 'light',
        colorMode: 'blue',
      });
    }
    return user;
  }

  async updateProfile(updateData: Partial<User>): Promise<User | null> {
    const user = await this.getProfile();
    if ((user as any)._id) {
      return this.userModel.findByIdAndUpdate((user as any)._id, updateData, { new: true }).exec();
    }
    return null;
  }

  async resetWorkspace(): Promise<{ success: boolean }> {
    await this.userModel.deleteMany({});
    return { success: true };
  }
}

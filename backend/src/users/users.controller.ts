import { Controller, Get, Patch, Delete, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile() {
    return this.usersService.getProfile();
  }

  @Patch('profile')
  updateProfile(@Body() body: any) {
    return this.usersService.updateProfile(body);
  }

  @Delete('workspace')
  leaveWorkspace() {
    return this.usersService.resetWorkspace();
  }
}

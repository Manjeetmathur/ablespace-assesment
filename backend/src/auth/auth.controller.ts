import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  continueAsGuest() {
    return this.authService.continueAsGuest();
  }

  @Post('login')
  login(@Body() body: { email: string; password?: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  register(@Body() body: { name: string; email: string; password?: string }) {
    return this.authService.register(body.name, body.email, body.password);
  }

  @Post('google')
  googleLogin(
    @Body() body: { credential?: string; email?: string; name?: string; avatar?: string; googleId?: string },
  ) {
    return this.authService.googleLogin(body);
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async continueAsGuest() {
    const user = await this.usersService.createGuestUser();
    const token = `guest_token_${Date.now()}`;
    return {
      statusCode: 200,
      message: 'Guest session initialized successfully',
      token,
      user,
    };
  }

  async login(email: string, password?: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    let user = await this.usersService.findByEmail(email);
    if (!user) {
      const name = email.split('@')[0];
      user = await this.usersService.createRealUser(name, email);
    }

    const token = `user_token_${Date.now()}`;
    return {
      statusCode: 200,
      message: 'User logged in successfully',
      token,
      user,
    };
  }

  async register(name: string, email: string, password?: string) {
    if (!email || !name) {
      throw new BadRequestException('Name and email are required');
    }

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      const token = `user_token_${Date.now()}`;
      return { statusCode: 200, message: 'User already exists, logged in', token, user: existing };
    }

    const user = await this.usersService.createRealUser(name, email);
    const token = `user_token_${Date.now()}`;
    return {
      statusCode: 201,
      message: 'User registered successfully',
      token,
      user,
    };
  }

  async googleLogin(payload: {
    credential?: string;
    accessToken?: string;
    email?: string;
    name?: string;
    avatar?: string;
    googleId?: string;
  }) {
    let email = payload.email;
    let name = payload.name;
    let avatar = payload.avatar;
    let googleId = payload.googleId;

    // 1. Verify Google ID Token if passed
    if (payload.credential) {
      try {
        const { OAuth2Client } = await import('google-auth-library');
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        const client = new OAuth2Client(googleClientId);
        const ticket = await client.verifyIdToken({
          idToken: payload.credential,
          audience: googleClientId,
        });
        const googlePayload = ticket.getPayload();
        if (googlePayload) {
          email = googlePayload.email;
          name = googlePayload.name;
          avatar = googlePayload.picture;
          googleId = googlePayload.sub;
        }
      } catch (e) {
        // Parse JWT payload directly from standard Google OAuth ID Token
        try {
          const parts = payload.credential.split('.');
          if (parts.length === 3) {
            const decodedPayload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            email = decodedPayload.email;
            name = decodedPayload.name;
            avatar = decodedPayload.picture;
            googleId = decodedPayload.sub;
          }
        } catch (err) {}
      }
    } else if (payload.accessToken) {
      // 2. Fetch Google User Info using Access Token from OAuth2 endpoint
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${payload.accessToken}` },
        });
        if (res.ok) {
          const info = await res.json();
          email = info.email;
          name = info.name;
          avatar = info.picture;
          googleId = info.sub;
        }
      } catch (err) {}
    }

    if (!email) {
      throw new BadRequestException('Google authentication failed: Email not found in Google OAuth response');
    }

    const userName = name || email.split('@')[0];
    const userAvatar = avatar || '';

    const user = await this.usersService.findOrCreateGoogleUser(email, userName, userAvatar, googleId);
    const token = `google_token_${Date.now()}`;

    return {
      statusCode: 200,
      message: 'Google login successful',
      token,
      user,
    };
  }
}

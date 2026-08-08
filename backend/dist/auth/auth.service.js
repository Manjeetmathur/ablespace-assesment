"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService) {
        this.usersService = usersService;
    }
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
    async login(email, password) {
        if (!email) {
            throw new common_1.BadRequestException('Email is required');
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
    async register(name, email, password) {
        if (!email || !name) {
            throw new common_1.BadRequestException('Name and email are required');
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
    async googleLogin(payload) {
        let email = payload.email;
        let name = payload.name;
        let avatar = payload.avatar;
        let googleId = payload.googleId;
        if (payload.credential) {
            try {
                const { OAuth2Client } = await Promise.resolve().then(() => require('google-auth-library'));
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
            }
            catch (e) {
                try {
                    const parts = payload.credential.split('.');
                    if (parts.length === 3) {
                        const decodedPayload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                        email = decodedPayload.email;
                        name = decodedPayload.name;
                        avatar = decodedPayload.picture;
                        googleId = decodedPayload.sub;
                    }
                }
                catch (err) { }
            }
        }
        else if (payload.accessToken) {
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
            }
            catch (err) { }
        }
        if (!email) {
            throw new common_1.BadRequestException('Google authentication failed: Email not found in Google OAuth response');
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
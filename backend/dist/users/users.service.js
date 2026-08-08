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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async onModuleInit() {
    }
    async createGuestUser() {
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
    async findByEmail(email) {
        return await this.userModel.findOne({ email }).exec();
    }
    async findOrCreateGoogleUser(email, name, avatar, googleId) {
        let user = await this.userModel.findOne({
            $or: [{ email }, { googleId: googleId || 'non-existent-id' }],
        }).exec();
        const username = email.split('@')[0];
        if (user) {
            user.name = name || user.name;
            if (avatar)
                user.avatar = avatar;
            if (googleId)
                user.googleId = googleId;
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
    async createRealUser(name, email) {
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
    async getProfile() {
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
    async updateProfile(updateData) {
        const user = await this.getProfile();
        if (user._id) {
            return this.userModel.findByIdAndUpdate(user._id, updateData, { new: true }).exec();
        }
        return null;
    }
    async resetWorkspace() {
        await this.userModel.deleteMany({});
        return { success: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map
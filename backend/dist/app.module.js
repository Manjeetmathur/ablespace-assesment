"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
require("dotenv/config");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const tasks_module_1 = require("./tasks/tasks.module");
const projects_module_1 = require("./projects/projects.module");
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/abletaskmanager';
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(mongoUri, {
                serverSelectionTimeoutMS: 10000,
                connectionFactory: (connection) => {
                    connection.on('connected', () => {
                        console.log('✅ [MongoDB] Connected to database successfully!');
                    });
                    connection.on('error', (err) => {
                        console.error('❌ [MongoDB] Connection error:', err);
                    });
                    connection.on('disconnected', () => {
                        console.warn('⚠️ [MongoDB] Disconnected from database');
                    });
                    return connection;
                },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            tasks_module_1.TasksModule,
            projects_module_1.ProjectsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
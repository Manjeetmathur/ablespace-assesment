import 'dotenv/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/abletaskmanager';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('✅ [MongoDB] Connected to database successfully!');
        });
        connection.on('error', (err: any) => {
          console.error('❌ [MongoDB] Connection error:', err);
        });
        connection.on('disconnected', () => {
          console.warn('⚠️ [MongoDB] Disconnected from database');
        });
        return connection;
      },
    }),
    AuthModule,
    UsersModule,
    TasksModule,
    ProjectsModule,
  ],
})
export class AppModule {}

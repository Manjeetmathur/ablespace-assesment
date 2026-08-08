import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

export class Member {
  @Prop({ required: true })
  name: string = '';

  @Prop()
  avatar?: string;

  @Prop()
  role?: string;
}

export class Subtask {
  @Prop({ required: true })
  id: string = '';

  @Prop({ required: true })
  title: string = '';

  @Prop({ default: 'NO_PRIORITY' })
  priority: string = 'NO_PRIORITY';

  @Prop({ type: Array, default: [] })
  members: Member[] = [];

  @Prop()
  dueDate?: string;

  @Prop({ default: false })
  completed: boolean = false;
}

export class Comment {
  @Prop({ required: true })
  id: string = '';

  @Prop({ required: true })
  authorName: string = '';

  @Prop()
  authorAvatar?: string;

  @Prop({ required: true })
  content: string = '';

  @Prop({ type: Array, default: [] })
  attachments: string[] = [];

  @Prop({ default: () => new Date().toISOString() })
  createdAt: string = new Date().toISOString();
}

export class ActivityLog {
  @Prop({ required: true })
  id: string = '';

  @Prop({ required: true })
  text: string = '';

  @Prop({ default: () => new Date().toISOString() })
  timestamp: string = new Date().toISOString();
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string = '';

  @Prop()
  description?: string;

  @Prop({ required: true })
  status: string = '';

  @Prop({ required: true })
  priority: string = '';

  @Prop({ type: Array })
  members: Member[] = [];

  @Prop()
  dueDate?: string;

  @Prop({ type: [String] })
  labels: string[] = [];

  @Prop({ type: [String] })
  teams: string[] = [];

  @Prop()
  reporter?: string;

  @Prop()
  project?: string;

  @Prop({ type: Array })
  resources: { title: string; url: string }[] = [];

  @Prop({ type: Array })
  subtasks: Subtask[] = [];

  @Prop({ type: Array })
  comments: Comment[] = [];

  @Prop({ type: Array })
  activityLogs: ActivityLog[] = [];

  @Prop()
  userId?: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

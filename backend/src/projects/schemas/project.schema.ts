import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string = '';

  @Prop()
  priority?: string;

  @Prop()
  leadName?: string;

  @Prop()
  leadAvatar?: string;

  @Prop({ default: 'IN_PROGRESS' })
  status?: string;

  @Prop({ default: 0 })
  tasksCount?: number;

  @Prop()
  userId?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

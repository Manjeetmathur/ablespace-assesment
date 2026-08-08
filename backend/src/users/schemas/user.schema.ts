import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, default: '' })
  name: string = '';

  @Prop({ default: '' })
  email: string = '';

  @Prop({ default: '' })
  avatar: string = '';

  @Prop({ default: '' })
  username: string = '';

  @Prop({ default: '' })
  title: string = '';

  @Prop({ default: true })
  isGuest: boolean = true;

  @Prop({ default: 'light' })
  theme: string = 'light';

  @Prop({ default: 'blue' })
  colorMode: string = 'blue';

  @Prop()
  googleId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

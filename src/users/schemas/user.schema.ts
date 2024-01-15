import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import { RolesType } from '../types';

export type QuizCategoryDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ default: RolesType.User })
  roles: RolesType[];

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

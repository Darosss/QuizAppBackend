import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';

export type QuizCategoryDocument = HydratedDocument<QuizCategory>;

@Schema({ timestamps: true })
export class QuizCategory {
  _id: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const QuizCategorySchema = SchemaFactory.createForClass(QuizCategory);

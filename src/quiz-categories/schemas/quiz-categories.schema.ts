import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';

export type QuizCategoryDocument = HydratedDocument<QuizCategory>;

@Schema({ timestamps: true })
export class QuizCategory {
  @Prop()
  name: string;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const QuizCategorySchema = SchemaFactory.createForClass(QuizCategory);

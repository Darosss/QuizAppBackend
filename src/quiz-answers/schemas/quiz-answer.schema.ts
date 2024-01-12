import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import { QuizQuestion } from 'src/quiz-questions';

export type QuizAnswerDocument = HydratedDocument<QuizAnswer>;

export type QuizAnswerDataType = {
  id: string;
  isCorrect: boolean;
  name: string;
};

@Schema({ timestamps: true })
export class QuizAnswer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'QuizQuestion' })
  question: QuizQuestion;

  @Prop()
  answers: QuizAnswerDataType[];

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const QuizAnswerSchema = SchemaFactory.createForClass(QuizAnswer);

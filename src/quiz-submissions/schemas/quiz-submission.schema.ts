import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import { QuizCategory } from 'src/quiz-categories';
import { User } from 'src/users';
import { QuizSubmissionCompletionsType } from '../types';

export type QuizSubmissionDocument = HydratedDocument<QuizSubmission>;

@Schema({ timestamps: true })
export class QuizSubmission {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'QuizCategory' })
  quizCategory: QuizCategory;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  completions: QuizSubmissionCompletionsType[];

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const QuizSubmissionSchema =
  SchemaFactory.createForClass(QuizSubmission);

import { IsArray, IsMongoId, IsString } from 'class-validator';
import { QuizSubmissionCompletionsType } from '../types';

export class CreateQuizSubmissionDto {
  @IsString()
  @IsMongoId()
  quizCategoryId: string;

  @IsString()
  @IsMongoId()
  userId: string;

  @IsArray()
  completions: QuizSubmissionCompletionsType[];
}

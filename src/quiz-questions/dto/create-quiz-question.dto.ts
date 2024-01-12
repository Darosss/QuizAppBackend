import { IsMongoId, IsString } from 'class-validator';

export class CreateQuizQuestionDto {
  @IsString()
  name: string;

  @IsMongoId()
  quizCategoryId: string;
}

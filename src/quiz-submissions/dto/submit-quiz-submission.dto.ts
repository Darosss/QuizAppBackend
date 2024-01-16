import { IsArray, IsMongoId, IsString } from 'class-validator';

export class SubmitQuizSubmissionDto {
  @IsArray()
  answeredQuestions: [string, string][];
}

export class SubmitQuizSubmissionServiceDto extends SubmitQuizSubmissionDto {
  @IsString()
  @IsMongoId()
  userId: string;
}

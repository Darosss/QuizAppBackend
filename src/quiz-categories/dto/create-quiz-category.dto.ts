import { IsString } from 'class-validator';

export class CreateQuizCategoryDto {
  @IsString()
  name: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizCategoryDto } from './create-quiz-category.dto';

export class UpdateQuizCategoryDto extends PartialType(CreateQuizCategoryDto) {}

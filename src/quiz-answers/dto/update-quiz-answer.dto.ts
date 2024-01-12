import { PartialType } from '@nestjs/swagger';
import { CreateQuizAnswerDto } from './create-quiz-answer.dto';

export class UpdateQuizAnswerDto extends PartialType(CreateQuizAnswerDto) {}

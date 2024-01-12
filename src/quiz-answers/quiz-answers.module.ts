import { Module, forwardRef } from '@nestjs/common';
import { QuizAnswersService } from './quiz-answers.service';
import { QuizAnswersController } from './quiz-answers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizAnswer, QuizAnswerSchema } from './schemas/quiz-answer.schema';
import { QuizQuestionsModule } from 'src/quiz-questions';

@Module({
  imports: [
    forwardRef(() => QuizQuestionsModule),
    MongooseModule.forFeature([
      { name: QuizAnswer.name, schema: QuizAnswerSchema },
    ]),
  ],
  controllers: [QuizAnswersController],
  providers: [QuizAnswersService],
  exports: [QuizAnswersService],
})
export class QuizAnswersModule {}

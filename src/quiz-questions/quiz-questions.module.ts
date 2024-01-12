import { Module, forwardRef } from '@nestjs/common';
import { QuizQuestionsService } from './quiz-questions.service';
import { QuizQuestionsController } from './quiz-questions.controller';
import {
  QuizQuestion,
  QuizQuestionSchema,
} from './schemas/quiz-question.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizCategoriesModule } from 'src/quiz-categories';
import { QuizAnswersModule } from 'src/quiz-answers';

@Module({
  imports: [
    forwardRef(() => QuizCategoriesModule),
    forwardRef(() => QuizAnswersModule),
    MongooseModule.forFeature([
      { name: QuizQuestion.name, schema: QuizQuestionSchema },
    ]),
  ],
  controllers: [QuizQuestionsController],
  providers: [QuizQuestionsService],
  exports: [QuizQuestionsService],
})
export class QuizQuestionsModule {}

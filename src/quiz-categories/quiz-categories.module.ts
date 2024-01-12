import { Module, forwardRef } from '@nestjs/common';
import { QuizCategoriesService } from './quiz-categories.service';
import { QuizCategoriesController } from './quiz-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuizCategory,
  QuizCategorySchema,
} from './schemas/quiz-categories.schema';
import { QuizQuestionsModule } from 'src/quiz-questions';

@Module({
  imports: [
    forwardRef(() => QuizQuestionsModule),
    MongooseModule.forFeature([
      { name: QuizCategory.name, schema: QuizCategorySchema },
    ]),
  ],
  controllers: [QuizCategoriesController],
  providers: [QuizCategoriesService],
  exports: [QuizCategoriesService],
})
export class QuizCategoriesModule {}

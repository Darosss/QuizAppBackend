import { Routes } from '@nestjs/core';
import { QuizAnswersModule } from './quiz-answers';
import { QuizCategoriesModule } from './quiz-categories';
import { QuizQuestionsModule } from './quiz-questions';
import { QuizSubmissionsModule } from './quiz-submissions';

export const routes: Routes = [
  {
    path: '/quizes',
    module: QuizCategoriesModule,
    children: [
      {
        path: '/answers',
        module: QuizAnswersModule,
      },
      {
        path: '/questions',
        module: QuizQuestionsModule,
      },
      {
        path: '/submissions',
        module: QuizSubmissionsModule,
      },
    ],
  },
];

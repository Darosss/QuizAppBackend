import { Module, forwardRef } from '@nestjs/common';
import { QuizSubmissionsService } from './quiz-submissions.service';
import { QuizSubmissionsController } from './quiz-submissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuizSubmission,
  QuizSubmissionSchema,
} from './schemas/quiz-submission.schema';
import { UsersModule } from 'src/users';
import { QuizAnswersModule } from 'src/quiz-answers';
import { QuizCategoriesModule } from 'src/quiz-categories';

@Module({
  imports: [
    UsersModule,
    QuizAnswersModule,
    forwardRef(() => QuizCategoriesModule),
    MongooseModule.forFeature([
      { name: QuizSubmission.name, schema: QuizSubmissionSchema },
    ]),
  ],
  controllers: [QuizSubmissionsController],
  providers: [QuizSubmissionsService],
  exports: [QuizSubmissionsService],
})
export class QuizSubmissionsModule {}

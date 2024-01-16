import { QuizCategory } from 'src/quiz-categories';
import { QuizSubmission } from './schemas/quiz-submission.schema';

export type QuizSubmissionCompletionsType = {
  totalAnswers: number;
  correctAnswers: number;
  completedAt: Date;
};

export type AnsweredQuestionsType = [string, string][];

export type TotalAndCorrectAnswersReturnType = {
  total: number;
  correct: number;
};

export type CreateSubmitQuizDataType = {
  userId: string;
  quizCategory: QuizCategory;
  completionsData: TotalAndCorrectAnswersReturnType;
};

export type UpdateSubmitQuizDataType = {
  subbmision: QuizSubmission;
  completionsData: TotalAndCorrectAnswersReturnType;
};

export type CreateSubmissionServiceDataType = {
  userId: string;
  quizCategoryId: string;
};

export type UpdateSubmissionServiceDataType =
  Partial<CreateSubmissionServiceDataType>;

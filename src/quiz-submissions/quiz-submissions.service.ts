import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { FilterQuery, Model, ProjectionType, now } from 'mongoose';
import { SubmitQuizSubmissionServiceDto } from './dto/submit-quiz-submission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { QuizSubmission } from './schemas/quiz-submission.schema';
import { UsersService } from 'src/users';
import {
  CheckAnsweredQuestionsReturnType,
  QuizAnswersService,
} from 'src/quiz-answers';
import {
  CreateSubmissionServiceDataType,
  CreateSubmitQuizDataType,
  QuizSubmissionCompletionsType,
  TotalAndCorrectAnswersReturnType,
  UpdateSubmissionServiceDataType,
  UpdateSubmitQuizDataType,
} from './types';
import { QuizCategoriesService } from 'src/quiz-categories';

type FilterQuerySubmissionType = FilterQuery<QuizSubmission>;
type ProjectionSubmissionType = ProjectionType<QuizSubmission>;

@Injectable()
export class QuizSubmissionsService {
  constructor(
    @InjectModel(QuizSubmission.name)
    private quizSubmissionModel: Model<QuizSubmission>,

    @Inject(UsersService)
    private usersService: UsersService,

    @Inject(QuizAnswersService)
    private quizAnswersService: QuizAnswersService,
    @Inject(forwardRef(() => QuizCategoriesService))
    private quizCategoriesService: QuizCategoriesService,
  ) {}

  async create({
    userId,
    quizCategoryId,
    ...rest
  }: CreateSubmissionServiceDataType) {
    const foundUser = await this.usersService.findOne({ _id: userId });
    const foundQuizCategory = await this.quizCategoriesService.findOne(
      quizCategoryId,
    );
    const createdSubmission = new this.quizSubmissionModel({
      foundUser,
      foundQuizCategory,
      ...rest,
    });
    return createdSubmission.save();
  }

  findAll(
    filter?: FilterQuerySubmissionType,
    projection?: ProjectionSubmissionType,
  ) {
    return this.quizSubmissionModel.find(filter, projection).exec();
  }

  async findOne(
    filter: FilterQuerySubmissionType,
    projection?: ProjectionSubmissionType,
  ) {
    const foundQuiz = await this.quizSubmissionModel
      .findOne(filter, projection)
      .exec();

    if (!foundQuiz)
      throw new NotFoundException({
        message: `Quiz not found`,
      });

    return foundQuiz;
  }

  update(id: string, updateData: UpdateSubmissionServiceDataType) {
    return this.quizSubmissionModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
  }

  remove(filter: FilterQuerySubmissionType) {
    return this.quizSubmissionModel.findByIdAndDelete(filter);
  }

  async submitByQuizId(quizId: string, data: SubmitQuizSubmissionServiceDto) {
    const canStartResponse = await this.quizCategoriesService.canStartQuiz(
      quizId,
    );
    if (!canStartResponse.canStart)
      throw new BadRequestException(
        `You need to wait at least ${canStartResponse.remainingTimeMS}ms`,
      );

    const reviewedAnswers =
      await this.quizAnswersService.checkAnsweredQuestions(
        data.answeredQuestions,
      );

    const totalAndCorrect = this.countTotalAndCorrectAnswers(reviewedAnswers);

    const foundSubmission = await this.quizSubmissionModel.findOne({
      quizCategory: quizId,
    });

    const quizCategory = await this.quizCategoriesService.findOne(quizId);

    if (!foundSubmission)
      return await this.createSubmitQuiz({
        quizCategory,
        completionsData: totalAndCorrect,
        ...data,
      });
    else
      return this.updateSubmitQuiz({
        completionsData: totalAndCorrect,
        subbmision: foundSubmission,
      });
  }

  private async createSubmitQuiz(data: CreateSubmitQuizDataType) {
    const { quizCategory, userId, completionsData } = data;
    const user = await this.usersService.findOne({ _id: userId });

    const completion = {
      totalAnswers: completionsData.total,
      correctAnswers: completionsData.correct,
      completedAt: now(),
    };
    await this.quizSubmissionModel.create({
      user,
      quizCategory: quizCategory,
      completions: [completion],
    });

    return completion;
  }

  private async updateSubmitQuiz(data: UpdateSubmitQuizDataType) {
    const newCompletion = {
      completedAt: now(),
      correctAnswers: data.completionsData.correct,
      totalAnswers: data.completionsData.total,
    };
    const updatedCompletions: QuizSubmissionCompletionsType[] = [
      ...data.subbmision.completions,
      newCompletion,
    ];

    await this.quizSubmissionModel.findByIdAndUpdate(
      data.subbmision._id.toString(),
      { completions: updatedCompletions },
    );

    return newCompletion;
  }

  private countTotalAndCorrectAnswers(
    data: CheckAnsweredQuestionsReturnType,
  ): TotalAndCorrectAnswersReturnType {
    const totalAndCorrect: TotalAndCorrectAnswersReturnType = {
      total: data.length,
      correct: data.filter(([, isCorrect]) => isCorrect).length,
    };

    return totalAndCorrect;
  }
}

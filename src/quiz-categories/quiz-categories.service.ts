import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateQuizCategoryDto } from './dto/create-quiz-category.dto';
import { UpdateQuizCategoryDto } from './dto/update-quiz-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { QuizCategory } from './schemas/quiz-categories.schema';
import { Model } from 'mongoose';
import { QuizSubmissionsService } from 'src/quiz-submissions/quiz-submissions.service';
import { QuizSubmissionCompletionsType } from 'src/quiz-submissions';
import { CanStartQuizReturnType } from './types';

const MINIMAL_WAIT_TIME_MS = 1000 * 60 * 60 * 24; // TODO: this from options quiz // for now 1day

@Injectable()
export class QuizCategoriesService {
  constructor(
    @InjectModel(QuizCategory.name)
    private quizCategoryModel: Model<QuizCategory>,

    @Inject(forwardRef(() => QuizSubmissionsService))
    private quizSubmissionService: QuizSubmissionsService,
  ) {}
  create(createQuizCategoryDto: CreateQuizCategoryDto): Promise<QuizCategory> {
    const createdCategory = new this.quizCategoryModel(createQuizCategoryDto);
    return createdCategory.save();
  }

  findAll(): Promise<QuizCategory[]> {
    return this.quizCategoryModel.find().exec();
  }

  async findOne(id: string): Promise<QuizCategory> {
    const foundQuiz = await this.quizCategoryModel.findById(id).exec();

    if (!foundQuiz)
      throw new NotFoundException({
        message: `Quiz with id(${id}) not found`,
      });

    return foundQuiz;
  }

  async canStartQuiz(
    id: string,
    userId: string,
  ): Promise<CanStartQuizReturnType> {
    const foundQuiz = await this.findOne(id);

    try {
      const foundSubmission = await this.quizSubmissionService.findOne({
        quizCategory: foundQuiz._id,
        user: userId,
      });

      const msBetweenLastCompletion = this.calculateMSTimeBetweenCompletion(
        foundSubmission.completions.at(-1),
      );

      if (msBetweenLastCompletion > MINIMAL_WAIT_TIME_MS)
        return {
          canStart: true,
        };
      else
        return {
          canStart: false,
          remainingTimeMS: MINIMAL_WAIT_TIME_MS - msBetweenLastCompletion,
        };
    } catch (err) {
      if (err instanceof NotFoundException) return { canStart: true };

      // idea there is to give possibility for start quiz when no resource found,
      // but when other error occurs = return false
      return { canStart: false };
    }
  }

  private calculateMSTimeBetweenCompletion(
    completion: QuizSubmissionCompletionsType,
  ): number {
    const diff = completion.completedAt.getTime() - new Date().getTime();

    return Math.abs(Math.round(diff));
  }

  update(
    id: string,
    updateQuizCategoryDto: UpdateQuizCategoryDto,
  ): Promise<QuizCategory> {
    return this.quizCategoryModel
      .findByIdAndUpdate(id, updateQuizCategoryDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.quizCategoryModel.findByIdAndDelete(id);
  }
}

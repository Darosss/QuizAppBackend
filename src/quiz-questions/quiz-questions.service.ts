import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { UpdateQuizQuestionDto } from './dto/update-quiz-question.dto';
import { InjectModel } from '@nestjs/mongoose';
import { QuizQuestion } from './schemas/quiz-question.schema';
import { Model } from 'mongoose';
import { QuizCategoriesService } from 'src/quiz-categories';

@Injectable()
export class QuizQuestionsService {
  constructor(
    @InjectModel(QuizQuestion.name)
    private quizQuestionModel: Model<QuizQuestion>,

    @Inject(forwardRef(() => QuizCategoriesService))
    private quizCategoriesService: QuizCategoriesService,
  ) {}

  async create({
    quizCategoryId,
    ...rest
  }: CreateQuizQuestionDto): Promise<QuizQuestion> {
    const foundQuizCategory = await this.quizCategoriesService.findOne(
      quizCategoryId,
    );

    const createdQuestion = new this.quizQuestionModel({
      quizCategory: foundQuizCategory,
      ...rest,
    });
    return createdQuestion.save();
  }

  findAll(): Promise<QuizQuestion[]> {
    return this.quizQuestionModel.find().exec();
  }

  async findOne(id: string): Promise<QuizQuestion> {
    const foundQuizQuestion = await this.quizQuestionModel.findById(id).exec();

    if (!foundQuizQuestion)
      throw new NotFoundException({
        message: `Quiz question with id(${id}) not found`,
      });

    return foundQuizQuestion;
  }

  async findManyByQuizCategoryId(id: string) {
    return this.quizQuestionModel.find({ quizCategory: id });
  }

  async update(
    id: string,
    { quizCategoryId, ...rest }: UpdateQuizQuestionDto,
  ): Promise<QuizQuestion> {
    const foundQuizCategory = quizCategoryId
      ? await this.quizCategoriesService.findOne(quizCategoryId)
      : undefined;

    return this.quizQuestionModel
      .findByIdAndUpdate(
        id,
        {
          ...(foundQuizCategory && { question: foundQuizCategory }),
          ...rest,
        },
        { new: true },
      )
      .exec();
  }

  remove(id: string) {
    return this.quizQuestionModel.findByIdAndDelete(id);
  }
}

import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateQuizAnswerDto } from './dto/create-quiz-answer.dto';
import { UpdateQuizAnswerDto } from './dto/update-quiz-answer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { QuizAnswer, QuizAnswerDataType } from './schemas/quiz-answer.schema';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { QuizQuestionsService } from 'src/quiz-questions';
import { AnsweredQuestionsType } from 'src/quiz-submissions';
import { CheckAnsweredQuestionsReturnType } from './types';

type FilterAnswerType = FilterQuery<QuizAnswer>;
type ProjectonType = ProjectionType<QuizAnswer>;

@Injectable()
export class QuizAnswersService {
  constructor(
    @InjectModel(QuizAnswer.name)
    private quizAnswerModel: Model<QuizAnswer>,

    @Inject(forwardRef(() => QuizQuestionsService))
    private quizQuestionsService: QuizQuestionsService,
  ) {}

  async create({
    questionId,
    answers,
  }: CreateQuizAnswerDto): Promise<QuizAnswer> {
    const foundQuizQuestion = await this.quizQuestionsService.findOne(
      questionId,
    );

    const answersWithIds: QuizAnswerDataType[] = answers.map(
      (answer, index) => ({
        ...answer,
        id: String(index),
      }),
    );

    const createdAnswer = new this.quizAnswerModel({
      question: foundQuizQuestion,
      answers: answersWithIds,
    });
    return createdAnswer.save();
  }

  findAll(): Promise<QuizAnswer[]> {
    return this.quizAnswerModel.find().exec();
  }

  async findOne(
    filter: FilterAnswerType,
    projection?: ProjectonType,
  ): Promise<QuizAnswer> {
    const foundQuizAnswer = await this.quizAnswerModel
      .findOne(filter, projection)
      .exec();

    if (!foundQuizAnswer)
      throw new NotFoundException({
        message: `Quiz answer not found`,
      });

    return foundQuizAnswer;
  }

  findOneByQuestionId(
    id: string,
    projection?: ProjectonType,
  ): Promise<QuizAnswer> {
    return this.quizAnswerModel.findOne({ question: id }, projection);
  }

  async update(
    id: string,
    { questionId, ...rest }: UpdateQuizAnswerDto,
  ): Promise<QuizAnswer> {
    const foundQuizQuestion = questionId
      ? await this.quizQuestionsService.findOne(questionId)
      : undefined;

    return this.quizAnswerModel
      .findByIdAndUpdate(
        id,
        {
          ...(foundQuizQuestion && { question: foundQuizQuestion }),
          ...rest,
        },
        { new: true },
      )
      .exec();
  }

  async checkAnsweredQuestions(
    answeredQuestions: AnsweredQuestionsType,
  ): Promise<CheckAnsweredQuestionsReturnType> {
    const answeredValues: CheckAnsweredQuestionsReturnType = [];

    for await (const [questionId, answerValue] of answeredQuestions) {
      const answer = await this.findOne({ question: questionId });
      const isCorrect = answer.answers.find(
        ({ id }) => id === answerValue,
      )?.isCorrect;

      answeredValues.push([questionId, isCorrect]);
    }

    return answeredValues;
  }

  remove(id: string) {
    return this.quizAnswerModel.findByIdAndDelete(id);
  }
}

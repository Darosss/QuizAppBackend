import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizCategoryDto } from './dto/create-quiz-category.dto';
import { UpdateQuizCategoryDto } from './dto/update-quiz-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { QuizCategory } from './schemas/quiz-categories.schema';
import { Model } from 'mongoose';

@Injectable()
export class QuizCategoriesService {
  constructor(
    @InjectModel(QuizCategory.name)
    private quizCategoryModel: Model<QuizCategory>,
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

  update(
    id: string,
    updateQuizCategoryDto: UpdateQuizCategoryDto,
  ): Promise<QuizCategory> {
    return this.quizCategoryModel
      .findByIdAndUpdate(id, updateQuizCategoryDto)
      .exec();
  }

  remove(id: string) {
    return this.quizCategoryModel.findByIdAndDelete(id);
  }
}

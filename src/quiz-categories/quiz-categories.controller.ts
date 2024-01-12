import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { QuizCategoriesService } from './quiz-categories.service';
import { CreateQuizCategoryDto } from './dto/create-quiz-category.dto';
import { UpdateQuizCategoryDto } from './dto/update-quiz-category.dto';
import { OnlyIDParamDTO } from 'src/mongo';
import { QuizQuestionsService } from 'src/quiz-questions';

@Controller()
export class QuizCategoriesController {
  constructor(
    private readonly quizCategoriesService: QuizCategoriesService,
    @Inject(forwardRef(() => QuizQuestionsService))
    private readonly quizQuestionsService: QuizQuestionsService,
  ) {}

  @Post()
  create(@Body() createQuizCategoryDto: CreateQuizCategoryDto) {
    return this.quizCategoriesService.create(createQuizCategoryDto);
  }

  @Get()
  findAll() {
    return this.quizCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: OnlyIDParamDTO) {
    return this.quizCategoriesService.findOne(id);
  }

  @Get(':id/questions')
  findCategoryQuestions(@Param() { id }: OnlyIDParamDTO) {
    return this.quizQuestionsService.findManyByQuizCategoryId(id);
  }

  @Patch(':id')
  update(
    @Param() { id }: OnlyIDParamDTO,
    @Body() updateQuizCategoryDto: UpdateQuizCategoryDto,
  ) {
    return this.quizCategoriesService.update(id, updateQuizCategoryDto);
  }

  @Delete(':id')
  remove(@Param() { id }: OnlyIDParamDTO) {
    try {
      return this.quizCategoriesService.remove(id);
    } catch (err) {
      throw err;
    }
  }
}

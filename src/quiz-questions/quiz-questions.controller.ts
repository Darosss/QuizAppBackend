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
import { QuizQuestionsService } from './quiz-questions.service';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { UpdateQuizQuestionDto } from './dto/update-quiz-question.dto';
import { OnlyIDParamDTO } from 'src/mongo';
import { QuizAnswersService } from 'src/quiz-answers';
import { RolesAdminSuperAdminGuard } from 'src/auth';

@Controller()
export class QuizQuestionsController {
  constructor(
    private readonly quizQuestionsService: QuizQuestionsService,
    @Inject(forwardRef(() => QuizAnswersService))
    private readonly quizAnswersService: QuizAnswersService,
  ) {}

  @RolesAdminSuperAdminGuard()
  @Post()
  create(@Body() createQuizQuestionDto: CreateQuizQuestionDto) {
    return this.quizQuestionsService.create(createQuizQuestionDto);
  }

  @RolesAdminSuperAdminGuard()
  @Get()
  findAll() {
    return this.quizQuestionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') { id }: OnlyIDParamDTO) {
    return this.quizQuestionsService.findOne(id);
  }

  @Get(':id/answers')
  findCategoryQuestions(@Param() { id }: OnlyIDParamDTO) {
    return this.quizAnswersService.findOneByQuestionId(id, {
      answers: { isCorrect: false },
    });
  }

  @RolesAdminSuperAdminGuard()
  @Patch(':id')
  update(
    @Param('id') { id }: OnlyIDParamDTO,
    @Body() updateQuizQuestionDto: UpdateQuizQuestionDto,
  ) {
    return this.quizQuestionsService.update(id, updateQuizQuestionDto);
  }

  @RolesAdminSuperAdminGuard()
  @Delete(':id')
  remove(@Param('id') { id }: OnlyIDParamDTO) {
    return this.quizQuestionsService.remove(id);
  }
}

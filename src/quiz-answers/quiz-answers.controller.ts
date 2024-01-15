import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuizAnswersService } from './quiz-answers.service';
import { CreateQuizAnswerDto } from './dto/create-quiz-answer.dto';
import { UpdateQuizAnswerDto } from './dto/update-quiz-answer.dto';
import { OnlyIDParamDTO } from 'src/mongo';
import { RolesAdminSuperAdminGuard } from 'src/auth';

@Controller()
export class QuizAnswersController {
  constructor(private readonly quizAnswersService: QuizAnswersService) {}

  @RolesAdminSuperAdminGuard()
  @Post()
  create(@Body() createQuizAnswerDto: CreateQuizAnswerDto) {
    return this.quizAnswersService.create(createQuizAnswerDto);
  }

  @RolesAdminSuperAdminGuard()
  @Get()
  findAll() {
    return this.quizAnswersService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: OnlyIDParamDTO) {
    return this.quizAnswersService.findOne(id, {
      answers: { isCorrect: false },
    });
  }

  @RolesAdminSuperAdminGuard()
  @Patch(':id')
  update(
    @Param() { id }: OnlyIDParamDTO,
    @Body() updateQuizAnswerDto: UpdateQuizAnswerDto,
  ) {
    return this.quizAnswersService.update(id, updateQuizAnswerDto);
  }

  @RolesAdminSuperAdminGuard()
  @Delete(':id')
  remove(@Param() { id }: OnlyIDParamDTO) {
    return this.quizAnswersService.remove(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Request,
} from '@nestjs/common';
import { QuizSubmissionsService } from './quiz-submissions.service';
import { CreateQuizSubmissionDto } from './dto/create-quiz-submission.dto';
import { UpdateQuizSubmissionDto } from './dto/update-quiz-submission.dto';
import { RolesAdminSuperAdminGuard, RolesSuperAdminGuard } from 'src/auth';
import { OnlyIDParamDTO } from 'src/mongo';
import { SubmitQuizSubmissionDto } from './dto/submit-quiz-submission.dto';

@Controller()
export class QuizSubmissionsController {
  constructor(
    private readonly quizSubmissionsService: QuizSubmissionsService,
  ) {}

  @RolesSuperAdminGuard()
  @Post()
  create(@Body() createQuizSubmissionDto: CreateQuizSubmissionDto) {
    return this.quizSubmissionsService.create(createQuizSubmissionDto);
  }

  @RolesAdminSuperAdminGuard()
  @Get()
  findAll() {
    return this.quizSubmissionsService.findAll();
  }

  @RolesAdminSuperAdminGuard()
  @Get(':id')
  findOne(@Param() { id }: OnlyIDParamDTO) {
    return this.quizSubmissionsService.findOne({ _id: id });
  }

  @Put(':id/submit')
  submitQuizAnswers(
    @Param() { id }: OnlyIDParamDTO,
    @Body() submitQuizDto: SubmitQuizSubmissionDto,
    @Request() req,
  ) {
    return this.quizSubmissionsService.submitByQuizId(id, {
      userId: req.user.sub,
      ...submitQuizDto,
    });
  }

  @RolesAdminSuperAdminGuard()
  @Patch(':id')
  update(
    @Param() { id }: OnlyIDParamDTO,
    @Body() updateQuizSubmissionDto: UpdateQuizSubmissionDto,
  ) {
    return this.quizSubmissionsService.update(id, updateQuizSubmissionDto);
  }

  @RolesSuperAdminGuard()
  @Delete(':id')
  remove(@Param() { id }: OnlyIDParamDTO) {
    return this.quizSubmissionsService.remove({ _id: id });
  }
}

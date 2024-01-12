import { Test, TestingModule } from '@nestjs/testing';
import { QuizAnswersController } from './quiz-answers.controller';
import { QuizAnswersService } from './quiz-answers.service';

describe('QuizAnswersController', () => {
  let controller: QuizAnswersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizAnswersController],
      providers: [QuizAnswersService],
    }).compile();

    controller = module.get<QuizAnswersController>(QuizAnswersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

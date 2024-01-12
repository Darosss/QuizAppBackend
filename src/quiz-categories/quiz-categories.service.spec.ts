import { Test, TestingModule } from '@nestjs/testing';
import { QuizCategoriesService } from './quiz-categories.service';

describe('QuizCategoriesService', () => {
  let service: QuizCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizCategoriesService],
    }).compile();

    service = module.get<QuizCategoriesService>(QuizCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

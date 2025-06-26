import { Test, TestingModule } from '@nestjs/testing';
import { HelperTrainingExamService } from './helper-training-exam.service';

describe('HelperTrainingExamService', () => {
  let service: HelperTrainingExamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperTrainingExamService],
    }).compile();

    service = module.get<HelperTrainingExamService>(HelperTrainingExamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

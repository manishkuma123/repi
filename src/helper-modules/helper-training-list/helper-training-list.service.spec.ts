import { Test, TestingModule } from '@nestjs/testing';
import { HelperTrainingListService } from './helper-training-list.service';

describe('HelperTrainingListService', () => {
  let service: HelperTrainingListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperTrainingListService],
    }).compile();

    service = module.get<HelperTrainingListService>(HelperTrainingListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

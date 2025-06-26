import { Test, TestingModule } from '@nestjs/testing';
import { SubJobService } from './sub-job.service';

describe('SubJobService', () => {
  let service: SubJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubJobService],
    }).compile();

    service = module.get<SubJobService>(SubJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

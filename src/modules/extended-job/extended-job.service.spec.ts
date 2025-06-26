import { Test, TestingModule } from '@nestjs/testing';
import { ExtendedJobService } from './extended-job.service';

describe('ExtendedJobService', () => {
  let service: ExtendedJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtendedJobService],
    }).compile();

    service = module.get<ExtendedJobService>(ExtendedJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

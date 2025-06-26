import { Test, TestingModule } from '@nestjs/testing';
import { CancelJobService } from './cancel-job.service';

describe('CancelJobService', () => {
  let service: CancelJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CancelJobService],
    }).compile();

    service = module.get<CancelJobService>(CancelJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

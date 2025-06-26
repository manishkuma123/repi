import { Test, TestingModule } from '@nestjs/testing';
import { HelperJobReviewService } from './helper-job-review.service';

describe('HelperJobReviewService', () => {
  let service: HelperJobReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperJobReviewService],
    }).compile();

    service = module.get<HelperJobReviewService>(HelperJobReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

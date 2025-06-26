import { Test, TestingModule } from '@nestjs/testing';
import { PostponedJobService } from './postponed-job.service';

describe('PostponedJobService', () => {
  let service: PostponedJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostponedJobService],
    }).compile();

    service = module.get<PostponedJobService>(PostponedJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

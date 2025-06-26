import { Test, TestingModule } from '@nestjs/testing';
import { MainJobService } from './main-job.service';

describe('MainJobService', () => {
  let service: MainJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MainJobService],
    }).compile();

    service = module.get<MainJobService>(MainJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

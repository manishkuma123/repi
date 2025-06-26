import { Test, TestingModule } from '@nestjs/testing';
import { TeamPerformanceService } from './team-performance.service';

describe('TeamPerformanceService', () => {
  let service: TeamPerformanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamPerformanceService],
    }).compile();

    service = module.get<TeamPerformanceService>(TeamPerformanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

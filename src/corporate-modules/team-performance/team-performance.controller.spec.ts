import { Test, TestingModule } from '@nestjs/testing';
import { TeamPerformanceController } from './team-performance.controller';

describe('TeamPerformanceController', () => {
  let controller: TeamPerformanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamPerformanceController],
    }).compile();

    controller = module.get<TeamPerformanceController>(TeamPerformanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

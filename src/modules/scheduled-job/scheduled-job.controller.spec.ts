import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledJobController } from './scheduled-job.controller';

describe('ScheduledJobController', () => {
  let controller: ScheduledJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduledJobController],
    }).compile();

    controller = module.get<ScheduledJobController>(ScheduledJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

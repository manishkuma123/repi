import { Test, TestingModule } from '@nestjs/testing';
import { ExtendedJobController } from './extended-job.controller';

describe('ExtendedJobController', () => {
  let controller: ExtendedJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExtendedJobController],
    }).compile();

    controller = module.get<ExtendedJobController>(ExtendedJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

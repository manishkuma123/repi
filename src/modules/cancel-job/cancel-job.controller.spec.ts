import { Test, TestingModule } from '@nestjs/testing';
import { CancelJobController } from './cancel-job.controller';

describe('CancelJobController', () => {
  let controller: CancelJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CancelJobController],
    }).compile();

    controller = module.get<CancelJobController>(CancelJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

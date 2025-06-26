import { Test, TestingModule } from '@nestjs/testing';
import { MainJobController } from './main-job.controller';

describe('MainJobController', () => {
  let controller: MainJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainJobController],
    }).compile();

    controller = module.get<MainJobController>(MainJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

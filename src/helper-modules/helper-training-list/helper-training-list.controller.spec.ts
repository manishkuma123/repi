import { Test, TestingModule } from '@nestjs/testing';
import { HelperTrainingListController } from './helper-training-list.controller';

describe('HelperTrainingListController', () => {
  let controller: HelperTrainingListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelperTrainingListController],
    }).compile();

    controller = module.get<HelperTrainingListController>(HelperTrainingListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

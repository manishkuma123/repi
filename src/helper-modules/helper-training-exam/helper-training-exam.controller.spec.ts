import { Test, TestingModule } from '@nestjs/testing';
import { HelperTrainingExamController } from './helper-training-exam.controller';

describe('HelperTrainingExamController', () => {
  let controller: HelperTrainingExamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelperTrainingExamController],
    }).compile();

    controller = module.get<HelperTrainingExamController>(HelperTrainingExamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { HelperJobReviewController } from './helper-job-review.controller';

describe('HelperJobReviewController', () => {
  let controller: HelperJobReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelperJobReviewController],
    }).compile();

    controller = module.get<HelperJobReviewController>(HelperJobReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PostponedJobController } from './postponed-job.controller';

describe('PostponedJobController', () => {
  let controller: PostponedJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostponedJobController],
    }).compile();

    controller = module.get<PostponedJobController>(PostponedJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

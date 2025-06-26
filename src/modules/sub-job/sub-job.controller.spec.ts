import { Test, TestingModule } from '@nestjs/testing';
import { SubJobController } from './sub-job.controller';

describe('SubJobController', () => {
  let controller: SubJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubJobController],
    }).compile();

    controller = module.get<SubJobController>(SubJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

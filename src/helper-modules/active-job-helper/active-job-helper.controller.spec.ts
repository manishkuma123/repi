import { Test, TestingModule } from '@nestjs/testing';
import { ActiveJobHelperController } from './active-job-helper.controller';

describe('ActiveJobHelperController', () => {
  let controller: ActiveJobHelperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActiveJobHelperController],
    }).compile();

    controller = module.get<ActiveJobHelperController>(
      ActiveJobHelperController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

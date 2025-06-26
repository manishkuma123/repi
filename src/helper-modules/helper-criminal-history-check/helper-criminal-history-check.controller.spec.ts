import { Test, TestingModule } from '@nestjs/testing';
import { HelperCriminalHistoryCheckController } from './helper-criminal-history-check.controller';

describe('HelperCriminalHistoryCheckController', () => {
  let controller: HelperCriminalHistoryCheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelperCriminalHistoryCheckController],
    }).compile();

    controller = module.get<HelperCriminalHistoryCheckController>(HelperCriminalHistoryCheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

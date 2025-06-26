import { Test, TestingModule } from '@nestjs/testing';
import { HelperEventController } from './helper-event.controller';

describe('HelperEventController', () => {
  let controller: HelperEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelperEventController],
    }).compile();

    controller = module.get<HelperEventController>(HelperEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

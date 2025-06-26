import { Test, TestingModule } from '@nestjs/testing';
import { NotificationHelperController } from './notification-helper.controller';

describe('NotificationHelperController', () => {
  let controller: NotificationHelperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationHelperController],
    }).compile();

    controller = module.get<NotificationHelperController>(NotificationHelperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

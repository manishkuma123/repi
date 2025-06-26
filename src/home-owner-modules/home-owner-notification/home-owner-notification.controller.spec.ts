import { Test, TestingModule } from '@nestjs/testing';
import { HomeOwnerNotificationController } from './home-owner-notification.controller';

describe('HomeOwnerNotificationController', () => {
  let controller: HomeOwnerNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeOwnerNotificationController],
    }).compile();

    controller = module.get<HomeOwnerNotificationController>(HomeOwnerNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

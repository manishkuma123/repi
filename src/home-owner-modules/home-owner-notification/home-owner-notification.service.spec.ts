import { Test, TestingModule } from '@nestjs/testing';
import { NotificationHomeOwnerService } from './home-owner-notification.service';

describe('NotificationHomeOwnerService', () => {
  let service: NotificationHomeOwnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationHomeOwnerService],
    }).compile();

    service = module.get<NotificationHomeOwnerService>(
      NotificationHomeOwnerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

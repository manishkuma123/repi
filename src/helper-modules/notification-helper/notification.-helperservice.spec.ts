import { Test, TestingModule } from '@nestjs/testing';
import { NotificationHelperService } from './notification-helper.service';

describe('NotificationHelperService', () => {
  let service: NotificationHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationHelperService],
    }).compile();

    service = module.get<NotificationHelperService>(NotificationHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

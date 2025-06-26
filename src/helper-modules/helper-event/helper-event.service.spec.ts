import { Test, TestingModule } from '@nestjs/testing';
import { HelperEventService } from './helper-event.service';

describe('HelperEventService', () => {
  let service: HelperEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperEventService],
    }).compile();

    service = module.get<HelperEventService>(HelperEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

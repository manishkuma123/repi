import { Test, TestingModule } from '@nestjs/testing';
import { HelperCriminalHistoryCheckService } from './helper-criminal-history-check.service';

describe('HelperCriminalHistoryCheckService', () => {
  let service: HelperCriminalHistoryCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperCriminalHistoryCheckService],
    }).compile();

    service = module.get<HelperCriminalHistoryCheckService>(HelperCriminalHistoryCheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

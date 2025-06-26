import { Test, TestingModule } from '@nestjs/testing';
import { HelperBankDetailsService } from './helper-bank-details.service';

describe('HelperBankDetailsService', () => {
  let service: HelperBankDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperBankDetailsService],
    }).compile();

    service = module.get<HelperBankDetailsService>(HelperBankDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

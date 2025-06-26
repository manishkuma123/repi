import { Test, TestingModule } from '@nestjs/testing';
import { HelperWalletService } from './helper-wallet.service';

describe('HelperWalletService', () => {
  let service: HelperWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperWalletService],
    }).compile();

    service = module.get<HelperWalletService>(HelperWalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

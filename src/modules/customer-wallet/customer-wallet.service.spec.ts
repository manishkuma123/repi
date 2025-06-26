import { Test, TestingModule } from '@nestjs/testing';
import { CustomerWalletService } from './customer-wallet.service';

describe('CustomerWalletService', () => {
  let service: CustomerWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerWalletService],
    }).compile();

    service = module.get<CustomerWalletService>(CustomerWalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

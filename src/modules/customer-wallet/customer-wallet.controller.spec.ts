import { Test, TestingModule } from '@nestjs/testing';
import { CustomerWalletController } from './customer-wallet.controller';

describe('CustomerWalletController', () => {
  let controller: CustomerWalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerWalletController],
    }).compile();

    controller = module.get<CustomerWalletController>(CustomerWalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

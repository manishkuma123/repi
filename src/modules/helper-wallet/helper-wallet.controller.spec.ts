import { Test, TestingModule } from '@nestjs/testing';
import { HelperWalletController } from './helper-wallet.controller';

describe('HelperWalletController', () => {
  let controller: HelperWalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelperWalletController],
    }).compile();

    controller = module.get<HelperWalletController>(HelperWalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

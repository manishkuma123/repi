import { Test, TestingModule } from '@nestjs/testing';
import { HelperBankDetailsController } from './helper-bank-details.controller';

describe('HelperBankDetailsController', () => {
  let controller: HelperBankDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelperBankDetailsController],
    }).compile();

    controller = module.get<HelperBankDetailsController>(HelperBankDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

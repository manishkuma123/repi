import { Test, TestingModule } from '@nestjs/testing';
import { PhoneNoOtpHelperController } from './phone-no-otp-helper.controller';

describe('PhoneNoOtpHelperController', () => {
  let controller: PhoneNoOtpHelperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhoneNoOtpHelperController],
    }).compile();

    controller = module.get<PhoneNoOtpHelperController>(PhoneNoOtpHelperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

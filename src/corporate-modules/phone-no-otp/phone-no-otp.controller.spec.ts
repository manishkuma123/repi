import { Test, TestingModule } from '@nestjs/testing';
import { PhoneNoOtpController } from './phone-no-otp.controller';

describe('PhoneNoOtpController', () => {
  let controller: PhoneNoOtpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhoneNoOtpController],
    }).compile();

    controller = module.get<PhoneNoOtpController>(PhoneNoOtpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

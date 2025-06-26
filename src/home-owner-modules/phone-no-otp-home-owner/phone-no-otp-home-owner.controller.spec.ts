import { Test, TestingModule } from '@nestjs/testing';
import { PhoneNoOtpHomeOwnerController } from './phone-no-otp-home-owner.controller';

describe('PhoneNoOtpHomeOwnerController', () => {
  let controller: PhoneNoOtpHomeOwnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhoneNoOtpHomeOwnerController],
    }).compile();

    controller = module.get<PhoneNoOtpHomeOwnerController>(PhoneNoOtpHomeOwnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

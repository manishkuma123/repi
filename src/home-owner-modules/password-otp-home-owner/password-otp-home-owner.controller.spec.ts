import { Test, TestingModule } from '@nestjs/testing';
import { PasswordOtpHomeOwnerController } from './password-otp-home-owner.controller';

describe('PasswordOtpHomeOwnerController', () => {
  let controller: PasswordOtpHomeOwnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordOtpHomeOwnerController],
    }).compile();

    controller = module.get<PasswordOtpHomeOwnerController>(PasswordOtpHomeOwnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

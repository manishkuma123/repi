import { Test, TestingModule } from '@nestjs/testing';
import { PasswordOtpHelperController } from './password-otp-helper.controller';

describe('PasswordOtpHelperController', () => {
  let controller: PasswordOtpHelperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordOtpHelperController],
    }).compile();

    controller = module.get<PasswordOtpHelperController>(
      PasswordOtpHelperController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

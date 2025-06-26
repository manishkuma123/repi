import { Test, TestingModule } from '@nestjs/testing';
import { OtpHelperController } from './otp-helper.controller';

describe('OtpHelperController', () => {
  let controller: OtpHelperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpHelperController],
    }).compile();

    controller = module.get<OtpHelperController>(OtpHelperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

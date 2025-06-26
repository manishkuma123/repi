import { Test, TestingModule } from '@nestjs/testing';
import { OtpHomeOwnerController } from './otp-home-owner.controller';

describe('OtpHomeOwnerController', () => {
  let controller: OtpHomeOwnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpHomeOwnerController],
    }).compile();

    controller = module.get<OtpHomeOwnerController>(OtpHomeOwnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PasswordOtpHomeOwnerService } from './password-otp-home-owner.service';

describe('PasswordOtpHomeOwnerService', () => {
  let service: PasswordOtpHomeOwnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordOtpHomeOwnerService],
    }).compile();

    service = module.get<PasswordOtpHomeOwnerService>(PasswordOtpHomeOwnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PasswordOtpHelperService } from './password-otp-helper.service';

describe('PasswordOtpHelperService', () => {
  let service: PasswordOtpHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordOtpHelperService],
    }).compile();

    service = module.get<PasswordOtpHelperService>(PasswordOtpHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

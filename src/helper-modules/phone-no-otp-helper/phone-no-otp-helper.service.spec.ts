import { Test, TestingModule } from '@nestjs/testing';
import { PhoneNoOtpHelperService } from './phone-no-otp-helper.service';

describe('PhoneNoOtpHelperService', () => {
  let service: PhoneNoOtpHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhoneNoOtpHelperService],
    }).compile();

    service = module.get<PhoneNoOtpHelperService>(PhoneNoOtpHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PhoneNoOtpService } from './phone-no-otp.service';

describe('PhoneNoOtpService', () => {
  let service: PhoneNoOtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhoneNoOtpService],
    }).compile();

    service = module.get<PhoneNoOtpService>(PhoneNoOtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

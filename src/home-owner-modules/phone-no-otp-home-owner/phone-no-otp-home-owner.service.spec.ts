import { Test, TestingModule } from '@nestjs/testing';
import { PhoneNoOtpHomeOwnerService } from './phone-no-otp-home-owner.service';

describe('PhoneNoOtpHomeOwnerService', () => {
  let service: PhoneNoOtpHomeOwnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhoneNoOtpHomeOwnerService],
    }).compile();

    service = module.get<PhoneNoOtpHomeOwnerService>(PhoneNoOtpHomeOwnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { OtpHomeOwnerService } from './otp-home-owner.service';

describe('OtpHomeOwnerService', () => {
  let service: OtpHomeOwnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtpHomeOwnerService],
    }).compile();

    service = module.get<OtpHomeOwnerService>(OtpHomeOwnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

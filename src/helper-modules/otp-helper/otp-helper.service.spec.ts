import { Test, TestingModule } from '@nestjs/testing';
import { OtpHelperService } from './otp-helper.service';

describe('OtpHelperService', () => {
  let service: OtpHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtpHelperService],
    }).compile();

    service = module.get<OtpHelperService>(OtpHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthHomeOwnerService } from './auth-home-owner.service';

describe('AuthHomeOwnerService', () => {
  let service: AuthHomeOwnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthHomeOwnerService],
    }).compile();

    service = module.get<AuthHomeOwnerService>(AuthHomeOwnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

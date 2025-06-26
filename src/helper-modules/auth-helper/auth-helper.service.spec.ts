import { Test, TestingModule } from '@nestjs/testing';
import { AuthHelperService } from './auth-helper.service';

describe('AuthHelperService', () => {
  let service: AuthHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthHelperService],
    }).compile();

    service = module.get<AuthHelperService>(AuthHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

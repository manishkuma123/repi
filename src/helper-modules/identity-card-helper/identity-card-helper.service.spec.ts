import { Test, TestingModule } from '@nestjs/testing';
import { IdentityCardHelperService } from './identity-card-helper.service';

describe('IdentityCardHelperService', () => {
  let service: IdentityCardHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdentityCardHelperService],
    }).compile();

    service = module.get<IdentityCardHelperService>(IdentityCardHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

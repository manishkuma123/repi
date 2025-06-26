import { Test, TestingModule } from '@nestjs/testing';
import { ForeignPassportHelperService } from './foreign-passport-helper.service';

describe('ForeignPassportHelperService', () => {
  let service: ForeignPassportHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForeignPassportHelperService],
    }).compile();

    service = module.get<ForeignPassportHelperService>(ForeignPassportHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

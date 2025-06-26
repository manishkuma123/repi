import { Test, TestingModule } from '@nestjs/testing';
import { SkilHelperService } from './skill-helper.service';

describe('SkilHelperService', () => {
  let service: SkilHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkilHelperService],
    }).compile();

    service = module.get<SkilHelperService>(SkilHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

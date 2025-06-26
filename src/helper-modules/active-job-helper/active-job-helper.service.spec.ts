import { Test, TestingModule } from '@nestjs/testing';
import { ActiveJobHelperService } from './active-job-helper.service';

describe('ActiveJobHelperService', () => {
  let service: ActiveJobHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActiveJobHelperService],
    }).compile();

    service = module.get<ActiveJobHelperService>(ActiveJobHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

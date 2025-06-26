import { Test, TestingModule } from '@nestjs/testing';
import { SiteCheckListHelperService } from './site-check-list-helper.service';

describe('SiteCheckListHelperService', () => {
  let service: SiteCheckListHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SiteCheckListHelperService],
    }).compile();

    service = module.get<SiteCheckListHelperService>(SiteCheckListHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

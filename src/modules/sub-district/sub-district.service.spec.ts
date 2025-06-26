import { Test, TestingModule } from '@nestjs/testing';
import { SubDistrictService } from './sub-district.service';

describe('SubDistrictService', () => {
  let service: SubDistrictService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubDistrictService],
    }).compile();

    service = module.get<SubDistrictService>(SubDistrictService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

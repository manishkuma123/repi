import { Test, TestingModule } from '@nestjs/testing';
import { WarrantyPeriodHelperService } from './warranty-period-helper.service';

describe('WarrantyPeriodHelperService', () => {
  let service: WarrantyPeriodHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarrantyPeriodHelperService],
    }).compile();

    service = module.get<WarrantyPeriodHelperService>(WarrantyPeriodHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

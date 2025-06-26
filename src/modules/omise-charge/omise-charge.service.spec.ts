import { Test, TestingModule } from '@nestjs/testing';
import { OmiseChargeService } from './omise-charge.service';

describe('OmiseChargeService', () => {
  let service: OmiseChargeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OmiseChargeService],
    }).compile();

    service = module.get<OmiseChargeService>(OmiseChargeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

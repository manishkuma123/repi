import { Test, TestingModule } from '@nestjs/testing';
import { WarrantyPeriodHelperController } from './warranty-period-helper.controller';
import { WarrantyPeriodHelperService } from './warranty-period-helper.service';

describe('WarrantyPeriodHelperController', () => {
  let controller: WarrantyPeriodHelperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarrantyPeriodHelperController],
      providers: [WarrantyPeriodHelperService],
    }).compile();

    controller = module.get<WarrantyPeriodHelperController>(WarrantyPeriodHelperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

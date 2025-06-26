import { Test, TestingModule } from '@nestjs/testing';
import { OmiseChargeController } from './omise-charge.controller';
import { OmiseChargeService } from './omise-charge.service';

describe('OmiseChargeController', () => {
  let controller: OmiseChargeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OmiseChargeController],
      providers: [OmiseChargeService],
    }).compile();

    controller = module.get<OmiseChargeController>(OmiseChargeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

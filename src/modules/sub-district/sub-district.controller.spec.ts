import { Test, TestingModule } from '@nestjs/testing';
import { SubDistrictController } from './sub-district.controller';

describe('SubDistrictController', () => {
  let controller: SubDistrictController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubDistrictController],
    }).compile();

    controller = module.get<SubDistrictController>(SubDistrictController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

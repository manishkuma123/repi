import { Test, TestingModule } from '@nestjs/testing';
import { ForeignPassportHelperController } from './foreign-passport-helper.controller';

describe('ForeignPassportHelperController', () => {
  let controller: ForeignPassportHelperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForeignPassportHelperController],
    }).compile();

    controller = module.get<ForeignPassportHelperController>(ForeignPassportHelperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

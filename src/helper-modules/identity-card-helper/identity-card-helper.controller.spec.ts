import { Test, TestingModule } from '@nestjs/testing';
import { IdentityCardHelperController } from './identity-card-helper.controller';

describe('IdentityCardHelperController', () => {
  let controller: IdentityCardHelperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdentityCardHelperController],
    }).compile();

    controller = module.get<IdentityCardHelperController>(IdentityCardHelperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

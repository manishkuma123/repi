import { Test, TestingModule } from '@nestjs/testing';
import { AuthHomeOwnerController } from './auth-home-owner.controller';

describe('AuthHomeOwnerController', () => {
  let controller: AuthHomeOwnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthHomeOwnerController],
    }).compile();

    controller = module.get<AuthHomeOwnerController>(AuthHomeOwnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

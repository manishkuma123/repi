import { Test, TestingModule } from '@nestjs/testing';
import { AuthHelperController } from './auth-helper.controller';

describe('AuthHelperController', () => {
  let controller: AuthHelperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthHelperController],
    }).compile();

    controller = module.get<AuthHelperController>(AuthHelperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { HomeOwnerController } from './home-owner.controller';

describe('HomeOwnerController', () => {
  let controller: HomeOwnerController;



  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeOwnerController],
    }).compile();

    controller = module.get<HomeOwnerController>(HomeOwnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

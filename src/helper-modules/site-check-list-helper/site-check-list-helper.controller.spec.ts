import { Test, TestingModule } from '@nestjs/testing';
import { SiteCheckListHelperController } from './site-check-list-helper.controller';

describe('SiteCheckListHelperController', () => {
  let controller: SiteCheckListHelperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiteCheckListHelperController],
    }).compile();

    controller = module.get<SiteCheckListHelperController>(SiteCheckListHelperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

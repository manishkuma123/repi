import { Test, TestingModule } from '@nestjs/testing';
import { HelperSkillController } from './skill-helper.controller';

describe('HelperSkillController', () => {
  let controller: HelperSkillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelperSkillController],
    }).compile();

    controller = module.get<HelperSkillController>(HelperSkillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

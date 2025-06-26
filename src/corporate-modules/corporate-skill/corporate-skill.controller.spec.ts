import { Test, TestingModule } from '@nestjs/testing';
import { CorporateSkillController } from './corporate-skill.controller';

describe('CorporateSkillController', () => {
  let controller: CorporateSkillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorporateSkillController],
    }).compile();

    controller = module.get<CorporateSkillController>(CorporateSkillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

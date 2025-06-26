import { Test, TestingModule } from '@nestjs/testing';
import { CorporateSkillService } from './corporate-skill.service';

describe('CorporateSkillService', () => {
  let service: CorporateSkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorporateSkillService],
    }).compile();

    service = module.get<CorporateSkillService>(CorporateSkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

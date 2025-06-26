import { Controller, Get, Param } from '@nestjs/common';
import { CorporateSkillService } from './corporate-skill.service';
import { ResponseDTO } from 'src/dtos/general-response/general-response';

@Controller('corporate-skill')
export class CorporateSkillController {
  constructor(private readonly corporateSkillService: CorporateSkillService) {}

  @Get('corporate-id/:corporateId')
  async getSkillsByCorporateId(
    @Param('corporateId') corporateId: string,
  ): Promise<ResponseDTO> {
    return this.corporateSkillService.getSkillsByCorporateId(corporateId);
  }

  @Get('all')
  async getAllCorporateSkills(): Promise<ResponseDTO> {
    return this.corporateSkillService.getAllCorporateSkills();
  }
}

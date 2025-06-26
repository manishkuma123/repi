import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SkilHelperService } from './skill-helper.service';
import { CreateSkillsHelperResponseDTO } from './dtos/response/create-expertise-helper.dto';
import { AuthGuard } from '../guards/AuthGuard';
import { Request } from 'express';
import { CreateSkillsHelperDTO } from './dtos/request/create-expertise-helper.dto';
import { UpdateSkillsHelperDTO } from './dtos/request/update-expertises-helper.dto';
import { UpdateSkillHelperDTO } from './dtos/request/update-expertise-helper.dto';
import { UpdateSkillHelperResponseDTO } from './dtos/response/update-expertise-helper.dto';

@Controller('helper/skill')
export class HelperSkillController {
  constructor(private readonly skilHelperService: SkilHelperService) {}

  @UseGuards(AuthGuard)
  @Post()
  async bulkCreate(
    @Body() createSkillsHelperDTO: CreateSkillsHelperDTO,
    @Req() request: any,
  ): Promise<CreateSkillsHelperResponseDTO> {
    return this.skilHelperService.createSkill(
      createSkillsHelperDTO,
      request?.user,
    );
  }

  @Get('/:helper_id')
  async getAllByHelperId(@Param('helper_id') helper_id: string) {
    return this.skilHelperService.getAllByHelperId(helper_id);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async updateSkills(
    @Body() updateSkillsHelperDTO: UpdateSkillsHelperDTO,
    @Req() req: any,
  ) {
    return this.skilHelperService.updateSkill(updateSkillsHelperDTO, req?.user);
  }

  @UseGuards(AuthGuard)
  @Patch('/:skillId')
  async updateSkillById(
    @Body() updateSkillHelperDTO: UpdateSkillHelperDTO,
    @Param('skillId') skillId: string,
    @Req() req: any,
  ): Promise<UpdateSkillHelperResponseDTO> {
    return this.skilHelperService.updateSkillById(
      updateSkillHelperDTO,
      skillId,
      req?.user?._id,
    );
  }
}

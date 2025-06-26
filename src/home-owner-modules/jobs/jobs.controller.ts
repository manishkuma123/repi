import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { getHelperBasedonSkillAndDistanceResponseDTO } from './dtos/response/get-helpers-based-on-skill-and-distance.dto';
import { GetHelpersBasedConditionRequestDTO } from './dtos/request/get-helpers-based-on-skill-and-distance.dto';
import { CreateSearchJobRequestDTO } from './dtos/request/create-job.dto';
import { AuthGuard } from 'src/helper-modules/guards/AuthGuard';
import { getUserJobIdsResponseDTO } from './dtos/response/get_user_job_ids.dto';

@Controller('home-owner/jobs')
@UseGuards(AuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async createJobAndGetSuggestedHelper(
    @Req() req: any,
    @Body()
    createSearchJobRequestDTO: CreateSearchJobRequestDTO,
  ): Promise<getHelperBasedonSkillAndDistanceResponseDTO> {
    return this.jobsService.getSugguestedHelpersBasedOnCondition(
      req?.user?._id,
      createSearchJobRequestDTO,
    );
  }

  @Get()
  async getUserJobIds(@Req() req: any): Promise<getUserJobIdsResponseDTO> {
    return this.jobsService.getUserJobIds(req?.user?._id);
  }
}

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SiteCheckListHelperService } from './site-check-list-helper.service';
import { CreateSiteCheckListHelperDTO } from './dtos/request/create-site-check-list-helper.dto';
import { CreateSiteCheckListHelperResponseDTO } from './dtos/response/create-site-check-list-helper.dto';
import { GetAllSiteCheckListByMainAndSubJobIdResponseDTO } from './dtos/response/get-all-site-check-list-by-main-and-sub-job-id';
import { AuthGuard } from '../guards/AuthGuard';

@Controller('helper/site-check-list')
@UseGuards(AuthGuard)
export class SiteCheckListHelperController {
  constructor(
    private readonly siteCheckListHelperService: SiteCheckListHelperService,
  ) {}

  @Post()
  async create(
    @Body() createSiteCheckListDto: CreateSiteCheckListHelperDTO,
  ): Promise<CreateSiteCheckListHelperResponseDTO> {
    return this.siteCheckListHelperService.create(createSiteCheckListDto);
  }

  @Get('main-job/:mainJobId/sub-job/:subJobId')
  async findByMainJobAndSubJob(
    @Param('mainJobId') mainJobId: string,
    @Param('subJobId') subJobId: string,
  ): Promise<GetAllSiteCheckListByMainAndSubJobIdResponseDTO> {
    return this.siteCheckListHelperService.findByMainJobAndSubJob(
      mainJobId,
      subJobId,
    );
  }
}

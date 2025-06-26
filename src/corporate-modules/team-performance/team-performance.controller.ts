import { Controller, Get, Query, Param, Req, UseGuards } from '@nestjs/common';
import { TeamPerformanceService } from './team-performance.service';
import { AuthGuard } from 'src/helper-modules/guards/AuthGuard';

@Controller('corporate/team-performance')
@UseGuards(AuthGuard)
export class TeamPerformanceController {
  constructor(
    private readonly teamPerformanceService: TeamPerformanceService,
  ) {}

  @Get('corporate-revenue')
  async getCorporateRevenue(
    @Req() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.teamPerformanceService.getCorporateRevenue(
      req?.user?._id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('trending-income')
  async getTrendingIncome(
    @Req() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.teamPerformanceService.getTrendingIncome(
      req?.user?._id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}

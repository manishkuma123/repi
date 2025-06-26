import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { CalenderService } from './calender.service';
import { AuthGuard } from 'src/helper-modules/guards/AuthGuard';

@Controller('corporate/calender')
@UseGuards(AuthGuard)
export class CalenderController {
  constructor(private readonly calenderService: CalenderService) {}

  @Get()
  async getCorporateRevenue(
    @Req() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.calenderService.getUpcomingAndInProgressJobsForCalender(
      req?.user?._id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}

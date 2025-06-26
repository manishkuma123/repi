import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ActiveJobHelperService } from './active-job-helper.service';
import { AuthGuard } from '../guards/AuthGuard';

@Controller('helper/active-job')
@UseGuards(AuthGuard)
export class ActiveJobHelperController {
  constructor(
    private readonly activeJobHelperService: ActiveJobHelperService,
  ) {}

  @Get('upcoming-jobs/month/:month/year/:year')
  async getUpcomingOffers(
    @Req() req: any,
    @Param('month') month: number,
    @Param('year') year: number,
  ) {
    return this.activeJobHelperService.getUpcomingOffers(
      req?.user?._id,
      month,
      year,
    );
  }
}

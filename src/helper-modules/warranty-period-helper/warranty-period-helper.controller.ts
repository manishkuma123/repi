import { Controller, Post, Body, Get } from '@nestjs/common';
import { WarrantyPeriodHelperService } from './warranty-period-helper.service';

@Controller('helper/warranty-period')
export class WarrantyPeriodHelperController {
  constructor(private readonly warrantyPeriodHelperService: WarrantyPeriodHelperService) {}

  @Post("update")
  async updateWarrantyPeriod(@Body() body: any) {

    const warrantyPeriod = await this.warrantyPeriodHelperService.updatewarrantyPeriodHelperService(body.helper_id, body.days);

    return warrantyPeriod;
  }

  @Get("cron/release-on-hold-payment")
  async releaseOnHoldPaymentCron(@Body() body: any) {

    const cronData = await this.warrantyPeriodHelperService.releaseOnHoldPaymentCron();

    return cronData;
  }

  @Get("cron/send-review-notification")
  async sendReviewNotificationCron(@Body() body: any) {

    const cronData = await this.warrantyPeriodHelperService.sendReviewNotificationCron();

    return cronData;
  }
}

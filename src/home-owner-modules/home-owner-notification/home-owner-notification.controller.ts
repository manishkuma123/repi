import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { NotificationHomeOwnerService } from './home-owner-notification.service';
import { AuthGuard } from 'src/helper-modules/guards/AuthGuard';

@Controller('home-owner/notification')
@UseGuards(AuthGuard)
export class HomeOwnerNotificationController {
  constructor(
    private readonly notificationHomeOwnerService: NotificationHomeOwnerService,
  ) {}

  @Get()
  async getNotification(@Req() req: any) {
    return this.notificationHomeOwnerService.getNotification(req?.user?._id);
  }
}

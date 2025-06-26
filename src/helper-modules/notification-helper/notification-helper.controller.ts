import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationHelperService } from './notification-helper.service';
import { AuthGuard } from '../guards/AuthGuard';

@Controller('helper/notification')
@UseGuards(AuthGuard)
export class NotificationHelperController {
  constructor(
    private readonly notificationHelperService: NotificationHelperService,
  ) {}

  @Get()
  async getNotification(@Req() req: any) {
    return this.notificationHelperService.getNotification(req?.user?._id);
  }

  @Patch('update/:id')
  async updateNotification(@Param('id') id: string) {
    return this.notificationHelperService.updateNotification(id);
  }
}

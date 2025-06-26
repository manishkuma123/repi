import { Module } from '@nestjs/common';
import { NotificationHelperService } from './notification-helper.service';
import { User, UserSchema } from 'src/entitites/user';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from 'src/entitites/notification';
import { NotificationHelperController } from './notification-helper.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [NotificationHelperService, JwtService],
  exports: [NotificationHelperService],
  controllers: [NotificationHelperController],
})
export class NotificationHelperModule {}

import { Module } from '@nestjs/common';
import { NotificationHomeOwnerService } from './home-owner-notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/entitites/user';
import { Notification, NotificationSchema } from 'src/entitites/notification';
import { HomeOwnerNotificationController } from './home-owner-notification.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [NotificationHomeOwnerService, JwtService],
  exports: [NotificationHomeOwnerService],
  controllers: [HomeOwnerNotificationController],
})
export class NotificationHomeOwnerModule {}

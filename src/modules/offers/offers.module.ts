import { Module } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchJob, SearchJobSchema } from 'src/entitites/search-job';
import { HelperOffer, HelperOfferSchema } from 'src/entitites/helper-offer';
import { User, UserSchema } from 'src/entitites/user';
import { AuthHelperModule } from '../../helper-modules/auth-helper/auth-helper.module';
import { NotificationHelperModule } from '../../helper-modules/notification-helper/notification-helper.module';
import { NotificationHomeOwnerModule } from 'src/home-owner-modules/home-owner-notification/home-owner-notification.module';
import { ScheduledJobModule } from '../scheduled-job/scheduled-job.module';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SearchJob.name, schema: SearchJobSchema },
      { name: HelperOffer.name, schema: HelperOfferSchema },
      { name: User.name, schema: UserSchema },
      { name: ScheduledJob.name, schema: ScheduledJobSchema },
    ]),
    AuthHelperModule,
    NotificationHelperModule,
    NotificationHomeOwnerModule,
    ScheduledJobModule,
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}

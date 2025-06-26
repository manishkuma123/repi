import { forwardRef,Module } from '@nestjs/common';
import { ScheduledJobController } from './scheduled-job.controller';
import { ScheduledJobService } from './scheduled-job.service';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthHomeOwnerModule } from 'src/home-owner-modules/auth-home-owner/auth-home-owner.module';
import { ExtendedJobModule } from '../extended-job/extended-job.module';
import { PostponedJobModule } from '../postponed-job/postponed-job.module';
import { User, UserSchema } from 'src/entitites/user';
import { SearchJob, SearchJobSchema } from 'src/entitites/search-job';
import { NotificationHelperModule } from 'src/helper-modules/notification-helper/notification-helper.module';
import { OmiseChargeModule } from '../omise-charge/omise-charge.module';
import { OmiseCharge, OmiseChargeSchema } from 'src/entitites/omise-charge';
import { CustomerWalletModule } from '../customer-wallet/customer-wallet.module';
import { HelperWalletModule } from '../helper-wallet/helper-wallet.module';
import { NotificationHomeOwnerModule } from 'src/home-owner-modules/home-owner-notification/home-owner-notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScheduledJob.name, schema: ScheduledJobSchema },
      { name: User.name, schema: UserSchema },
      { name: SearchJob.name, schema: SearchJobSchema },
      { name: OmiseCharge.name, schema: OmiseChargeSchema },
    ]),
    AuthHomeOwnerModule,
    ExtendedJobModule,
    PostponedJobModule,
    NotificationHelperModule,
    OmiseChargeModule,
    forwardRef(() => CustomerWalletModule),
    forwardRef(() => HelperWalletModule),
    NotificationHomeOwnerModule,
  ],
  controllers: [ScheduledJobController],
  providers: [ScheduledJobService],
  exports: [ScheduledJobService],
})
export class ScheduledJobModule {}

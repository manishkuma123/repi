import { Module,forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WarrantyPeriodHelperService } from './warranty-period-helper.service';
import { WarrantyPeriodHelperController } from './warranty-period-helper.controller';
import { User, UserSchema } from 'src/entitites/user';
import { CustomerWalletModule } from 'src/modules/customer-wallet/customer-wallet.module';
import { HelperWalletModule } from 'src/modules/helper-wallet/helper-wallet.module';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';
import { NotificationHomeOwnerModule } from 'src/home-owner-modules/home-owner-notification/home-owner-notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ScheduledJob.name, schema: ScheduledJobSchema }      
    ]),
    forwardRef(() => CustomerWalletModule),
    forwardRef(() => HelperWalletModule),
    NotificationHomeOwnerModule,
  ],
  controllers: [WarrantyPeriodHelperController],
  providers: [WarrantyPeriodHelperService],
})
export class WarrantyPeriodHelperModule {}

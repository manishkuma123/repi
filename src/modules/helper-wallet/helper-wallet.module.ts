import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperWalletService } from './helper-wallet.service';
import { HelperCashWallet, HelperCashWalletSchema} from 'src/entitites/helper-cash-wallet';
import { HelperPointWallet, HelperPointWalletSchema} from 'src/entitites/helper-point-wallet';
import { OmiseCharge, OmiseChargeSchema} from 'src/entitites/omise-charge';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';
import { Configuration, ConfigurationSchema } from 'src/entitites/configuration';
import { HelperWalletController } from './helper-wallet.controller';
import { CustomerWalletModule } from 'src/modules/customer-wallet/customer-wallet.module';
import { ScheduledJobModule } from '../scheduled-job/scheduled-job.module';
import { ConfigurationModule } from '../configuration/configuration.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HelperCashWallet.name, schema: HelperCashWalletSchema },
      { name: HelperPointWallet.name, schema: HelperPointWalletSchema },
      { name: OmiseCharge.name, schema: OmiseChargeSchema },
      { name: ScheduledJob.name, schema: ScheduledJobSchema },
      { name: Configuration.name, schema: ConfigurationSchema }      
    ]),
    forwardRef(() => CustomerWalletModule),
    forwardRef(() => ScheduledJobModule),
    forwardRef(() => ConfigurationModule),
  ],
  providers: [HelperWalletService],
  exports: [HelperWalletService],
  controllers: [HelperWalletController],
})
export class HelperWalletModule {}

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerWalletService } from './customer-wallet.service';
import { CustomerWalletController } from './customer-wallet.controller';
import { CustomerCashWallet, CustomerCashWalletSchema} from 'src/entitites/customer-cash-wallet';
import { CustomerPointWallet, CustomerPointWalletSchema} from 'src/entitites/customer-point-wallet';
import { OmiseCharge, OmiseChargeSchema} from 'src/entitites/omise-charge';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';
import { Configuration, ConfigurationSchema } from 'src/entitites/configuration';
import { HelperWalletModule } from 'src/modules/helper-wallet/helper-wallet.module';
import { ScheduledJobModule } from '../scheduled-job/scheduled-job.module';
import { ConfigurationModule } from '../configuration/configuration.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomerCashWallet.name, schema: CustomerCashWalletSchema },
      { name: CustomerPointWallet.name, schema: CustomerPointWalletSchema },
      { name: OmiseCharge.name, schema: OmiseChargeSchema },
      { name: ScheduledJob.name, schema: ScheduledJobSchema },
      { name: Configuration.name, schema: ConfigurationSchema }
    ]),
    forwardRef(() => HelperWalletModule),
    forwardRef(() => ScheduledJobModule),
    forwardRef(() => ConfigurationModule),

  ],
  providers: [CustomerWalletService],
  exports: [CustomerWalletService],
  controllers: [CustomerWalletController],
})
export class CustomerWalletModule {}

import { forwardRef,Module } from '@nestjs/common';
import { HelperJobReviewController } from './helper-job-review.controller';
import { HelperJobReviewService } from './helper-job-review.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HelperJobReview,
  HelperJobReviewSchema,
} from 'src/entitites/helper-job-review';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';
import { AuthHelperService } from '../auth-helper/auth-helper.service';
import { AuthHelperModule } from '../auth-helper/auth-helper.module';
import { CustomerWalletModule } from 'src/modules/customer-wallet/customer-wallet.module';
import { HelperWalletModule } from 'src/modules/helper-wallet/helper-wallet.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HelperJobReview.name, schema: HelperJobReviewSchema },
      { name: ScheduledJob.name, schema: ScheduledJobSchema },
    ]),
    AuthHelperModule,
    forwardRef(() => CustomerWalletModule),
    forwardRef(() => HelperWalletModule),
  ],
  controllers: [HelperJobReviewController],
  providers: [HelperJobReviewService],
  exports: [HelperJobReviewService],
})
export class HelperJobReviewModule {}

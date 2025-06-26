import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { GeoLocationModule } from 'src/helper-modules/geo-location/geo-location.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperSkill, HelperSkillSchema } from 'src/entitites/helper-skills';
import { SearchJob, SearchJobSchema } from 'src/entitites/search-job';
import { AuthHomeOwnerModule } from '../auth-home-owner/auth-home-owner.module';
import { MainJobModule } from 'src/modules/main-job/main-job.module';
import { SubJobModule } from 'src/modules/sub-job/sub-job-helper.module';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';
import { HelperJobReviewModule } from 'src/helper-modules/helper-job-review/helper-job-review.module';
import { HelperEventModule } from 'src/helper-modules/helper-event/helper-event.module';
import { HelperWalletModule } from 'src/modules/helper-wallet/helper-wallet.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SearchJob.name, schema: SearchJobSchema },
      { name: HelperSkill.name, schema: HelperSkillSchema },
      { name: ScheduledJob.name, schema: ScheduledJobSchema },
    ]),
    GeoLocationModule,
    AuthHomeOwnerModule,
    HelperJobReviewModule,
    MainJobModule,
    SubJobModule,
    HelperEventModule,
    HelperWalletModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}

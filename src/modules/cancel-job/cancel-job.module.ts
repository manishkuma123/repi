import { Module } from '@nestjs/common';
import { CancelJobController } from './cancel-job.controller';
import { CancelJobService } from './cancel-job.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CancelJob, CancelJobSchema } from 'src/entitites/cancel-job';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';
import { NotificationHelperModule } from 'src/helper-modules/notification-helper/notification-helper.module';
import { AuthHomeOwnerModule } from 'src/home-owner-modules/auth-home-owner/auth-home-owner.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CancelJob.name, schema: CancelJobSchema },
      { name: ScheduledJob.name, schema: ScheduledJobSchema },
    ]),

    NotificationHelperModule,
    AuthHomeOwnerModule,
  ],
  controllers: [CancelJobController],
  providers: [CancelJobService],
})
export class CancelJobModule {}

import { Module } from '@nestjs/common';
import { ExtendedJobController } from './extended-job.controller';
import { ExtendedJobService } from './extended-job.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExtendedJob, ExtendedJobSchema } from 'src/entitites/extended-job';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from 'src/entitites/user';
import { SearchJob, SearchJobSchema } from 'src/entitites/search-job';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';
import { NotificationHelperModule } from 'src/helper-modules/notification-helper/notification-helper.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExtendedJob.name, schema: ExtendedJobSchema },
      { name: User.name, schema: UserSchema },
      { name: SearchJob.name, schema: SearchJobSchema },
      { name: ScheduledJob.name, schema: ScheduledJobSchema },
    ]),
    NotificationHelperModule,
  ],
  controllers: [ExtendedJobController],
  providers: [ExtendedJobService, JwtService],
  exports: [ExtendedJobService],
})
export class ExtendedJobModule {}

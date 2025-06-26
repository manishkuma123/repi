import { Module } from '@nestjs/common';
import { PostponedJobController } from './postponed-job.controller';
import { PostponedJobService } from './postponed-job.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostponedJob, PostponedJobSchema } from 'src/entitites/postponed-job';
import { SearchJob, SearchJobSchema } from 'src/entitites/search-job';
import { NotificationHelperModule } from 'src/helper-modules/notification-helper/notification-helper.module';
import { User, UserSchema } from 'src/entitites/user';
import { AuthHelperModule } from 'src/helper-modules/auth-helper/auth-helper.module';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostponedJob.name, schema: PostponedJobSchema },
      { name: SearchJob.name, schema: SearchJobSchema },
      { name: User.name, schema: UserSchema },
      { name: ScheduledJob.name, schema: ScheduledJobSchema },
    ]),
    NotificationHelperModule,
    AuthHelperModule,
  ],
  controllers: [PostponedJobController],
  providers: [PostponedJobService],
  exports: [PostponedJobService],
})
export class PostponedJobModule {}

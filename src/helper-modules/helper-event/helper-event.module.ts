import { Module } from '@nestjs/common';
import { HelperEventController } from './helper-event.controller';
import { HelperEventService } from './helper-event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperEvent, HelperEventSchema } from 'src/entitites/helper-event';
import { User, UserSchema } from 'src/entitites/user';
import { AuthHelperModule } from '../auth-helper/auth-helper.module';
import { ScheduledJobService } from 'src/modules/scheduled-job/scheduled-job.service';
import { ScheduledJobModule } from 'src/modules/scheduled-job/scheduled-job.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HelperEvent.name, schema: HelperEventSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthHelperModule,
    ScheduledJobModule,
  ],
  controllers: [HelperEventController],
  providers: [HelperEventService],
  exports: [HelperEventService],
})
export class HelperEventModule {}

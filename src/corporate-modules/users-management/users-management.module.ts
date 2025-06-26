import { Module } from '@nestjs/common';
import { UsersManagementController } from './users-management.controller';
import { UsersManagementService } from './users-management.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/entitites/user';
import {
  InvitedHelper,
  InvitedHelperSchema,
} from 'src/entitites/invited-helpers';
import { JwtService } from '@nestjs/jwt';
import { GeoLocationModule } from 'src/helper-modules/geo-location/geo-location.module';
import { HelperSkill, HelperSkillSchema } from 'src/entitites/helper-skills';
import { SubJob, SubJobSchema } from 'src/entitites/sub-job';
import { HelperSkillModule } from 'src/helper-modules/expertise-helper/skill-helper.module';
import { ScheduledJobModule } from 'src/modules/scheduled-job/scheduled-job.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: InvitedHelper.name, schema: InvitedHelperSchema },
      { name: HelperSkill.name, schema: HelperSkillSchema },
      { name: SubJob.name, schema: SubJobSchema },
    ]),
    GeoLocationModule,
    HelperSkillModule,
    ScheduledJobModule,
  ],
  controllers: [UsersManagementController],
  providers: [UsersManagementService, JwtService],
  exports: [UsersManagementService],
})
export class UsersManagementModule {}

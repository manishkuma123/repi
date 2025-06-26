import { Module } from '@nestjs/common';
import { TeamPerformanceController } from './team-performance.controller';
import { TeamPerformanceService } from './team-performance.service';
import { User, UserSchema } from 'src/entitites/user';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ScheduledJobModule } from 'src/modules/scheduled-job/scheduled-job.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ScheduledJobModule,
  ],
  controllers: [TeamPerformanceController],
  providers: [TeamPerformanceService, JwtService],
})
export class TeamPerformanceModule {}

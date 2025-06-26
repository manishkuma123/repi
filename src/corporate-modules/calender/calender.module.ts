import { Module } from '@nestjs/common';
import { CalenderController } from './calender.controller';
import { CalenderService } from './calender.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduledJobModule } from 'src/modules/scheduled-job/scheduled-job.module';
import { User, UserSchema } from 'src/entitites/user';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ScheduledJobModule,
  ],
  controllers: [CalenderController],
  providers: [CalenderService, JwtService],
})
export class CalenderModule {}

import { Module } from '@nestjs/common';
import { ComplaintController } from './complaint.controller';
import { ComplaintService } from './complaint.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Complaint, ComplaintSchema } from 'src/entitites/complaints';
import { JwtService } from '@nestjs/jwt';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Complaint.name, schema: ComplaintSchema },
      { name: ScheduledJob.name, schema: ScheduledJobSchema },
    ]),
  ],
  controllers: [ComplaintController],
  providers: [ComplaintService, JwtService],
})
export class ComplaintModule {}

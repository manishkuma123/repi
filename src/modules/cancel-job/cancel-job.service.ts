import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CancelJob, CancelJobDocument } from 'src/entitites/cancel-job';
import {
  ScheduledJob,
  ScheduledJobDocument,
} from 'src/entitites/scheduled-job';
import { CreateCancelJobResponseDTO } from './dtos/response/create.dto';
import { CreateCancelJobDTO } from './dtos/request/create.dto';
import {
  eAPIResultStatus,
  JobProgress,
  NotificationType,
  Role,
} from 'src/utils/enum';
import { NotificationHelperService } from 'src/helper-modules/notification-helper/notification-helper.service';

@Injectable()
export class CancelJobService {
  constructor(
    @InjectModel(CancelJob.name)
    private cancelJobModel: Model<CancelJobDocument>,
    @InjectModel(ScheduledJob.name)
    private ScheduledJobModel: Model<ScheduledJobDocument>,

    private readonly notificationHelperService: NotificationHelperService,
  ) {}

  async create(dto: CreateCancelJobDTO): Promise<CreateCancelJobResponseDTO> {
    try {
      const existingJob = (await this.ScheduledJobModel.findOne({
        job_id: dto?.job_id,
      }).populate([
        { path: 'customer_id', select: 'profile_url _id' },
        {
          path: 'job_id',
          populate: { path: 'sub_job_id', select: '_id sub_job_name' },
        },
      ])) as any;
      if (!existingJob) {
        return { status: eAPIResultStatus.Failure, invalidJob: true };
      }

      const newCancelJob = new this.cancelJobModel({
        ...dto,
        customer_id: existingJob?.customer_id?._id,
        helper_id: existingJob?.helper_id,
        cancel_date: new Date(),
      });
      await newCancelJob.save();

      // update scheduled job status

      await this.ScheduledJobModel.updateOne(
        { _id: existingJob?._id },
        { $set: { job_status: JobProgress.Cancel } },
      );

      // send notification to helper

      const notificationDTO = {
        image: existingJob?.customer_id?.profile_url,
        title: 'Job Canceled',
        content: `The homeowner has canceled the job "${existingJob?.job_id?.sub_job_id?.sub_job_name?.en}" you were assigned to.`,
        sender_id: '' + existingJob?.customer_id?._id,
        receiver_id: existingJob?.helper_id,
        receiver_type: Role.Helper,
        sender_type: Role.Customer,
        notification_type: NotificationType.Job_Canceled,
      };

      await this.notificationHelperService.sendNotification(notificationDTO);

      return { status: eAPIResultStatus.Success };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExtendedJob, ExtendedJobDocument } from 'src/entitites/extended-job';
import { CreateExtendedJobDTO } from './dtos/request/create-extended-work.dto';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import {
  eAPIResultStatus,
  NotificationType,
  OfferStatus,
  Role,
} from 'src/utils/enum';
import { User, UserDocument } from 'src/entitites/user';
import { UpdateExtendedJobRequestDTO } from './dtos/request/update-extended-work.dto';
import { UpdateExtendedJobResponseDTO } from './dtos/response/update-extended-work.dto';
import { SearchJob, SearchJobDocument } from 'src/entitites/search-job';
import {
  ScheduledJob,
  ScheduledJobDocument,
} from 'src/entitites/scheduled-job';
import { NotificationHelperService } from 'src/helper-modules/notification-helper/notification-helper.service';

@Injectable()
export class ExtendedJobService {
  constructor(
    @InjectModel(ExtendedJob.name)
    private extendedJobModel: Model<ExtendedJobDocument>,

    @InjectModel(SearchJob.name)
    private searchJobModel: Model<SearchJobDocument>,

    @InjectModel(ScheduledJob.name)
    private ScheduledJobModel: Model<ScheduledJobDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    private readonly notificationService: NotificationHelperService,
  ) {}

  async create(
    createExtendedJobDto: CreateExtendedJobDTO,
    helper_id: string,
  ): Promise<ResponseDTO> {
    try {
      const newExtendedJob = new this.extendedJobModel(createExtendedJobDto);

      const data = await newExtendedJob.save();

      const helper = await this.userModel.findOne(
        { _id: helper_id, role: Role.Helper },
        { _id: 1, profile_url: 1 },
      );

      const notificationDTO = {
        image: helper?.profile_url,
        title: 'Job Extension Request',
        content: `Request to extend the job with extended_job_id: ${newExtendedJob?._id}. Please review and approve the extension request.`,
        sender_id: '' + helper?._id,
        receiver_id: createExtendedJobDto?.customer_id,
        receiver_type: Role.Customer,
        sender_type: Role.Helper,
        notification_type: NotificationType.Job_Extension_Requested,
      };

      //send-notification to home-owner
      await this.notificationService.sendNotification(notificationDTO);

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getLatestExtendedJobByJobId(job_id: string): Promise<ResponseDTO> {
    try {
      const data = await this.extendedJobModel
        .findOne({ job_id, status: OfferStatus.Accepted })
        .sort({ createdAt: -1 })
        .exec();

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getExtendedJobById(
    extended_job_id: string,
  ): Promise<UpdateExtendedJobResponseDTO> {
    try {
      const data = await this.extendedJobModel
        .findOne({ _id: extended_job_id })
        .lean()
        .exec();

      if (!data) {
        return {
          status: eAPIResultStatus.Failure,
          invalidExtendedJobId: true,
        };
      }
      const orderNumber = (
        await this.ScheduledJobModel.findOne({
          job_id: data?.job_id,
        })
      )?.order_number;

      return {
        status: eAPIResultStatus.Success,
        data: { ...data, orderNumber },
      };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async updateExtendedJobRequestStatus(
    extended_job_id: string,
    updateExtendJobDto: UpdateExtendedJobRequestDTO,
  ): Promise<UpdateExtendedJobResponseDTO> {
    try {
      const latestJob = await this.extendedJobModel
        .findOne({ _id: extended_job_id })
        .exec();

      if (!latestJob) {
        return {
          status: eAPIResultStatus.Failure,
          invalidExtendedJobId: true,
        };
      }

      latestJob.status = updateExtendJobDto?.status;
      await latestJob.save();

      await this.searchJobModel.updateOne(
        { _id: '' + latestJob?.job_id },
        {
          $set: {
            extended_start_date: latestJob?.start_date,
            extended_end_date: latestJob?.end_date,
          },
        },
      );

      return { status: eAPIResultStatus.Success };
    } catch (error) {
      console.log('ERROR :: ', error);
      return { status: eAPIResultStatus.Failure };
    }
  }
}

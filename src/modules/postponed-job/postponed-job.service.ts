import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PostponedJob,
  PostponedJobDocument,
} from 'src/entitites/postponed-job';
import { SearchJob, SearchJobDocument } from 'src/entitites/search-job';
import { CreatePostponedJobRequestDTO } from './dtos/request/create-postponed-job-request.dto';
import {
  eAPIResultStatus,
  JobStatus,
  NotificationType,
  OfferStatus,
  Role,
} from 'src/utils/enum';
import { CreatePostponedJobRequestResponseDTO } from './dtos/response/create-postponed-job-request.dto';
import { UpdatePostponedJobRequestDTO } from './dtos/request/update-postponed-job-request.dto';
import { NotificationHelperService } from 'src/helper-modules/notification-helper/notification-helper.service';
import { User, UserDocument } from 'src/entitites/user';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { GetPostponedJobDetailsResponseDTO } from './dtos/response/get_posponed_job_details.dto';
import {
  ScheduledJob,
  ScheduledJobDocument,
} from 'src/entitites/scheduled-job';

@Injectable()
export class PostponedJobService {
  constructor(
    @InjectModel(PostponedJob.name)
    private postponedJobModel: Model<PostponedJobDocument>,

    @InjectModel(SearchJob.name)
    private searchJobModel: Model<SearchJobDocument>,

    @InjectModel(ScheduledJob.name)
    private scheduledJobModel: Model<ScheduledJobDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    private readonly notificationService: NotificationHelperService,
  ) {}

  async createPostponedJob(
    userId: string,
    createPostponedJobRequestDTO: CreatePostponedJobRequestDTO,
  ): Promise<CreatePostponedJobRequestResponseDTO> {
    try {
      const customer = await this.userModel.findOne(
        { _id: userId, role: Role.Customer },
        { _id: 1, profile_url: 1 },
      );

      const postponedJobsCount = await this.getPostponedJobsCount(
        createPostponedJobRequestDTO?.job_id,
      );

      if (postponedJobsCount >= 2) {
        return {
          status: eAPIResultStatus.Failure,
          limitReached: true,
        };
      }

      const searchJob = await this.searchJobModel.findById(
        createPostponedJobRequestDTO?.job_id,
      );

      if (!searchJob) {
        return {
          status: eAPIResultStatus.Failure,
          invalidJobId: true,
        };
      }

      const postponedJob = await this.postponedJobModel.create({
        job_id: createPostponedJobRequestDTO?.job_id,
        helper_id: createPostponedJobRequestDTO?.helper_id,
        start_date: createPostponedJobRequestDTO?.start_date,
        end_date: createPostponedJobRequestDTO?.end_date,
        start_time: createPostponedJobRequestDTO?.start_time,
        end_time: createPostponedJobRequestDTO?.end_time,
        start_time_stamp: createPostponedJobRequestDTO?.start_time_stamp,
        end_time_stamp: createPostponedJobRequestDTO?.end_time_stamp,
        postponed_no: postponedJobsCount + 1,
      });

      //send notification to helper

      const notificationDTO = {
        image: customer?.profile_url,
        title: 'Job Postponed Request',
        content: `Request to postpone the job , postponed_job_id: ${postponedJob?._id}. Please acknowledge and update your schedule`,
        sender_id: '' + customer?._id,
        receiver_id: createPostponedJobRequestDTO?.helper_id,
        receiver_type: Role.Helper,
        sender_type: Role.Customer,
        notification_type: NotificationType.Job_Postponed_Request,
      };

      await this.notificationService.sendNotification(notificationDTO);

      return {
        status: eAPIResultStatus.Success,
      };
    } catch (error) {
      return {
        status: eAPIResultStatus.Failure,
      };
    }
  }

  async updatePostponedJob(
    helperId: string,
    id: string,
    updatePostponedJobRequestDTO: UpdatePostponedJobRequestDTO,
  ): Promise<CreatePostponedJobRequestResponseDTO> {
    try {
      const helper = await this.userModel.findOne(
        { _id: '' + helperId, role: Role.Helper },
        { _id: 1, profile_url: 1 },
      );
      const job = await this.searchJobModel.findById(
        updatePostponedJobRequestDTO?.job_id,
      );

      if (!job) {
        return {
          status: eAPIResultStatus.Failure,
          invalidJobId: true,
        };
      }
      const postponedJob = await this.postponedJobModel.findByIdAndUpdate(
        id,
        updatePostponedJobRequestDTO,
        { new: true },
      );

      if (updatePostponedJobRequestDTO?.status === OfferStatus.Accepted) {
        await this.searchJobModel.findByIdAndUpdate(
          updatePostponedJobRequestDTO?.job_id,
          {
            extended_start_date: postponedJob?.start_date,
            extended_end_date: postponedJob?.end_date,
          },
        );
      }

      const isAccepted =
        updatePostponedJobRequestDTO?.status === OfferStatus.Accepted
          ? true
          : false;

      const notificationDTO = {
        image: helper?.profile_url,
        title: isAccepted
          ? 'Job Postponement Accepted'
          : 'Job Postponement Rejected',
        content: isAccepted
          ? `Your request to postpone the job (postponed_job_id: ${postponedJob?._id}) has been accepted. The job will proceed as per the new schedule.`
          : `Your request to postpone the job (postponed_job_id: ${postponedJob?._id}) has been rejected. Please coordinate with your helper for further details.`,
        sender_id: '' + helper?._id,
        receiver_id: '' + job?.customer_id,
        receiver_type: Role.Customer,
        sender_type: Role.Helper,
        notification_type: NotificationType.Job_Postponed_Response,
      };

      await this.notificationService.sendNotification(notificationDTO);

      return {
        status: eAPIResultStatus.Success,
      };
    } catch (error) {
      return {
        status: eAPIResultStatus.Failure,
      };
    }
  }

  async getPostponedJobsCount(jobId: string) {
    try {
      const postponedJobsCount = await this.postponedJobModel.countDocuments({
        job_id: jobId,
      });

      return postponedJobsCount;
    } catch (error) {
      throw new Error('Failed to get postponed jobs count');
    }
  }

  async getPostponedJob(
    id: string,
  ): Promise<GetPostponedJobDetailsResponseDTO> {
    try {
      const postponedJob = await this.postponedJobModel
        .findOne({
          _id: id,
        })
        .populate(
          'job_id',
          'start_date end_date extended_end_date extended_start_date',
        );
      if (!postponedJob) {
        return {
          status: eAPIResultStatus.Failure,
          invalidPostponedJobId: true,
        };
      }

      const orderNumber = (
        await this.scheduledJobModel.findOne({
          job_id: '' + postponedJob?.job_id?._id,
        })
      )?.order_number;

      const NoOfLimitLeft =
        2 -
        ((await this.getPostponedJobsCount('' + postponedJob?.job_id?._id)) ??
          0);

      return {
        status: eAPIResultStatus.Success,
        data: { postponedJob, orderNumber, NoOfLimitLeft },
      };
    } catch (error) {
      return {
        status: eAPIResultStatus.Failure,
      };
    }
  }
}

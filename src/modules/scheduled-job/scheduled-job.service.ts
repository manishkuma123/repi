import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ScheduledJob,
  ScheduledJobDocument,
} from 'src/entitites/scheduled-job';
import { CreateScheduledJobDTO } from './dtos/request/create-scheduled-job';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import {
  eAPIResultStatus,
  JobProgress,
  NotificationType,
  Role,
} from 'src/utils/enum';
import { GetDetailsResponseDTO } from './dtos/response/get-details';
import { ExtendedJobService } from '../extended-job/extended-job.service';
import { PostponedJobService } from '../postponed-job/postponed-job.service';
import { CustomerWalletService } from '../customer-wallet/customer-wallet.service';
import { HelperWalletService } from '../helper-wallet/helper-wallet.service';
import { UpdateCustomerRatingDTO } from './dtos/request/update-customer-review';
import { UpdateCustomerRatingResponseDTO } from './dtos/response/update-customer-review';
import { UpdateJobStatusDTO } from './dtos/request/update-job-status';
import { User, UserDocument } from 'src/entitites/user';
import { SearchJob, SearchJobDocument } from 'src/entitites/search-job';
import { CreateCompletedJobDTO } from './dtos/request/create-completed-job';
import { NotificationHelperService } from 'src/helper-modules/notification-helper/notification-helper.service';
import { CreateScheduledJobResponseDTO } from './dtos/response/create-schedule-job.dto';
import { OmiseCharge, OmiseChargeDocument } from 'src/entitites/omise-charge';
import { NotificationHomeOwnerService } from 'src/home-owner-modules/home-owner-notification/home-owner-notification.service';

@Injectable()
export class ScheduledJobService {
  constructor(
    @InjectModel(ScheduledJob.name)
    private scheduledJobModel: Model<ScheduledJobDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(SearchJob.name)
    private searchJobModel: Model<SearchJobDocument>,

    @InjectModel(OmiseCharge.name)
    private omiseChargeModel: Model<OmiseChargeDocument>,

    private readonly extendedJobService: ExtendedJobService,
    private readonly postponedJobService: PostponedJobService,
    private readonly notificationHelperService: NotificationHelperService,
    private readonly notificationCustomerService: NotificationHomeOwnerService,
    private readonly customerWalletService: CustomerWalletService,
    private readonly helperWalletService: HelperWalletService,
  ) {}

  async createScheduledJob(
    createScheduledJobDto: CreateScheduledJobDTO,
  ): Promise<CreateScheduledJobResponseDTO> {
    try {
      const existingRecord = await this.scheduledJobModel.findOne({
        job_id: createScheduledJobDto?.job_id,
        is_deleted: false,
      });

      if (existingRecord) {
        return {
          status: eAPIResultStatus.Failure,
          jobIsAlreadyScheduled: true,
        };
      }
      const createdScheduledJob = new this.scheduledJobModel(
        createScheduledJobDto,
      );
      const data = await createdScheduledJob.save();

      const job: any = await this.searchJobModel
        .findById(createScheduledJobDto?.job_id)
        .populate({ path: 'main_job_id', select: 'main_job_name' });

      //update helper
      const helper = await this.userModel.findByIdAndUpdate(
        createScheduledJobDto?.helper_id,
        {
          $set: {
            last_order_id: '' + data?._id,
            last_order_job: job?.main_job_id?.main_job_name?.en,
          },
        },
        { new: true },
      );

      // update home-owner
      await this.userModel.findByIdAndUpdate(
        createScheduledJobDto?.customer_id,
        {
          $set: {
            last_order_id: '' + data?._id,
            last_helper: helper?.profile_name,
          },
        },
      );

      // link scheduled-job-id in omise charge
      const updatedJob = await this.omiseChargeModel.findByIdAndUpdate(
        createScheduledJobDto?.charge_id,
        {
          $set: {
            scheduled_job_id: '' + data?._id,
          },
        },
      );

      // Add to customer wallet
      await this.customerWalletService.creditedToWallet(
        createScheduledJobDto?.customer_id,
        createScheduledJobDto?.charge_id,
        '' + data?._id,
        createScheduledJobDto?.amount,
        createScheduledJobDto?.points,
      );

      // Add to helper wallet
      await this.helperWalletService.creditedToWallet(
        createScheduledJobDto?.helper_id,
        '' + data?._id,
        createScheduledJobDto?.amount,
        createScheduledJobDto?.points,
      );

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      console.error('Error creating scheduled-job:', error);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getAppointmentsByMonth(
    month: number,
    customer_id: string,
  ): Promise<GetDetailsResponseDTO> {
    try {
      if (month < 1 || month > 12) {
        return { status: eAPIResultStatus.Failure, invalidMonth: true };
      }

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const startOfMonth = new Date(currentYear, month - 1, 1);
      const endOfMonth = new Date(currentYear, month, 0, 23, 59, 59, 999);

      const scheduledJobs = await this.scheduledJobModel
        .find({
          customer_id: '' + customer_id,
          job_status: { $ne: JobProgress.Cancel },
        })
        .populate([
          {
            path: 'helper_id',
            select: ' trader_name  alias_name profile_name',
          },
          {
            path: 'job_id',
            match: {
              $or: [
                {
                  start_date: { $gte: startOfMonth, $lte: endOfMonth },
                },
                {
                  end_date: { $gte: startOfMonth, $lte: endOfMonth },
                },
                {
                  extended_start_date: { $gte: startOfMonth, $lte: endOfMonth },
                },
                {
                  extended_end_date: { $gte: startOfMonth, $lte: endOfMonth },
                },
              ],
            },

            populate: [
              {
                path: 'sub_job_id',
                select: 'job_descriptions sub_job_name',
              },
              { path: 'address_id' },
            ],
          },
        ])
        .exec();

      // Sort jobs by extended_start_date if present, otherwise by start_date
      scheduledJobs.sort((a: any, b: any) => {
        const dateA = a.job_id?.extended_start_date || a.job_id?.start_date;
        const dateB = b.job_id?.extended_start_date || b.job_id?.start_date;

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });

      const jobs = [];

      for (const job of scheduledJobs) {
        if (!job.job_id) continue;

        const postponedJobsCount =
          await this.postponedJobService.getPostponedJobsCount(
            String(job?.job_id?._id),
          );

        const resData =
          await this.extendedJobService.getLatestExtendedJobByJobId(
            String(job?.job_id?._id),
          );

        if (resData?.status === eAPIResultStatus.Success && resData?.data) {
          jobs.push({
            ...job.toObject(),
            extended: true,
            extended_details: resData?.data,
            postponed_jobs_limit: 2 - postponedJobsCount,
          });
        } else {
          jobs.push({
            ...job.toObject(),
            postponed_jobs_limit: 2 - postponedJobsCount,
          });
        }
      }

      if (month > currentMonth) {
        return {
          status: eAPIResultStatus.Success,
          upcoming_appointment: jobs,
          appointment_log: [],
        };
      } else {
        const upcoming_appointment = [];
        const appointment_log = [];

        for (const job of (jobs as any[]) || []) {
          if (
            job?.job_status === JobProgress.Pending ||
            job?.job_status === JobProgress.In_Progress ||
            job?.job_status === JobProgress.Rejected ||
            job?.job_status === JobProgress.Job_Completion_Confirmation
          ) {
            upcoming_appointment.push(job);
          } else if (
            job?.job_status === JobProgress.Completed ||
            job?.job_status === JobProgress.Reviewed
          ) {
            appointment_log.push(job);
          }
        }

        return {
          status: eAPIResultStatus.Success,
          upcoming_appointment,
          appointment_log,
        };
      }
    } catch (error) {
      console.error('Error retrieving scheduled jobs by month:', error);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getToDoJobsByMonth(
    month: number,
    helper_id: string,
  ): Promise<GetDetailsResponseDTO> {
    try {
      if (month < 1 || month > 12) {
        return { status: eAPIResultStatus.Failure, invalidMonth: true };
      }

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const startOfMonth = new Date(currentYear, month - 1, 1);
      const endOfMonth = new Date(currentYear, month, 0, 23, 59, 59, 999);
      const today = new Date();

      if (month < currentMonth) {
        return { status: eAPIResultStatus.Success, upcoming_appointment: [] };
      }

      const scheduledJobs = await this.scheduledJobModel
        .find({
          helper_id: '' + helper_id,
          job_status: { $ne: JobProgress.Cancel },
        })
        .populate([
          { path: 'customer_id', select: ' alias_name' },
          { path: 'helper_id', select: 'profile_url' },
          {
            path: 'job_id',
            match: {
              $or: [
                {
                  start_date: { $gte: startOfMonth, $lte: endOfMonth },
                },
                {
                  end_date: { $gte: startOfMonth, $lte: endOfMonth },
                },
                {
                  extended_start_date: { $gte: startOfMonth, $lte: endOfMonth },
                },
                {
                  extended_end_date: { $gte: startOfMonth, $lte: endOfMonth },
                },
              ],
            },
            populate: [
              {
                path: 'sub_job_id',
                select: 'job_descriptions sub_job_name',
              },
              {
                path: 'address_id',
                select: 'postal_address contact_name family_name location',
              },
            ],
          },
        ])
        .exec();

      const jobs = [];

      for (const job of scheduledJobs) {
        if (!job.job_id) continue;

        const postponedJobsCount =
          await this.postponedJobService.getPostponedJobsCount(
            String(job?.job_id?._id),
          );

        const resData =
          await this.extendedJobService.getLatestExtendedJobByJobId(
            String(job?.job_id?._id),
          );

        if (resData?.status === eAPIResultStatus.Success && resData?.data) {
          jobs.push({
            ...job.toObject(),
            extended: true,
            extended_details: resData?.data,
            postponed_jobs_limit: 2 - postponedJobsCount,
          });
        } else {
          jobs.push(job);
        }
      }

      if (month > currentMonth) {
        return {
          status: eAPIResultStatus.Success,
          upcoming_appointment: jobs,
        };
      } else {
        const upcoming_appointment = [];

        for (const job of (jobs as any[]) || []) {
          if (
            // (job?.job_id?.end_date >= today &&
            //   new Date(job?.job_id?.end_date).getMonth() + 1 == currentMonth) ||
            // (job?.job_id?.extended_end_date >= today &&
            //   new Date(job?.job_id?.extended_end_date).getMonth() + 1 ==
            //     currentMonth)
            job?.job_status === JobProgress.Pending ||
            job?.job_status === JobProgress.In_Progress ||
            job?.job_status === JobProgress.Rejected ||
            job?.job_status === JobProgress.Job_Completion_Confirmation
          ) {
            upcoming_appointment.push(job);
          }
        }

        return {
          status: eAPIResultStatus.Success,
          upcoming_appointment,
        };
      }
    } catch (error) {
      console.error('Error retrieving scheduled jobs by month:', error);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getOrderNumbersByCustomer() {
    try {
      const records = await this.scheduledJobModel
        .find({ order_number: { $exists: true, $ne: null } })
        .select('order_number')
        .lean();

      const orderNumbers = records.map((record) => record.order_number);

      return {
        status: eAPIResultStatus.Success,
        data: orderNumbers,
      };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getOrderNumbersByHelper() {
    try {
      const records = await this.scheduledJobModel
        .find({ order_number: { $exists: true, $ne: null } })
        .populate('job_id', 'prior_job pre_conditions_check_list')
        .select('order_number')
        .lean();

      return {
        status: eAPIResultStatus.Success,
        data: records,
      };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async addCustomerRating(
    updateCustomerRatingDTO: UpdateCustomerRatingDTO,
    _id: string,
  ): Promise<UpdateCustomerRatingResponseDTO> {
    try {
      const scheduledJob = await this.scheduledJobModel.findById(_id);

      if (!scheduledJob) {
        return { status: eAPIResultStatus.Failure, invalidScheduleJobId: true };
      }
      await this.scheduledJobModel.updateOne(
        { _id: scheduledJob?._id },
        { $set: { customer_rating: updateCustomerRatingDTO?.customer_rating } },
      );
      return { status: eAPIResultStatus.Success };
    } catch (error) {
      console.error('Error update customer rating:', error);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getCompletedJobs(helper_id: string): Promise<ResponseDTO> {
    try {
      const scheduledJob = await this.scheduledJobModel
        .find({
          helper_id,
          job_status: { $ne: JobProgress.Cancel },
        })
        .populate([
          {
            path: 'job_id',
            populate: { path: 'sub_job_id', select: '_id sub_job_name' },
          },
          { path: 'customer_id' },
        ]);

      const data = scheduledJob.filter(
        (job: any) =>
          job?.job_status === JobProgress.Completed ||
          job?.job_status === JobProgress.Reviewed,
      );
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      console.error('Error update customer rating:', error);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async updateJobStatus(
    updateJobStatusDTO: UpdateJobStatusDTO,
    _id: string,
  ): Promise<UpdateCustomerRatingResponseDTO> {
    try {
      const scheduledJob: any = await this.scheduledJobModel
        .findById(_id)
        .populate('customer_id', '_id profile_url');

      if (!scheduledJob) {
        return { status: eAPIResultStatus.Failure, invalidScheduleJobId: true };
      }
      await this.scheduledJobModel.updateOne(
        { _id: scheduledJob?._id },
        {
          $set: {
            job_status: updateJobStatusDTO?.job_status,
            started_date: updateJobStatusDTO?.started_date,
            started_time_stamp: updateJobStatusDTO?.started_time_stamp,
          },
        },
      );

      if (
        updateJobStatusDTO?.job_status === JobProgress.Completed ||
        updateJobStatusDTO?.job_status === JobProgress.Rejected
      ) {
        // send notification to helper
        const notificationDTO = {
          image: scheduledJob?.customer_id?.profile_url,
          title:
            updateJobStatusDTO?.job_status === JobProgress.Completed
              ? 'Job Completion Approved'
              : 'Job Completion Rejected',
          content:
            updateJobStatusDTO?.job_status === JobProgress.Completed
              ? `Congratulations, the owner approved your order ${scheduledJob?.order_number}.`
              : `Your job submission job_id: ${scheduledJob?._id}) has been rejected by the customer.`,
          sender_id: '' + scheduledJob?.customer_id?._id,
          receiver_id: scheduledJob?.helper_id,
          receiver_type: Role.Helper,
          sender_type: Role.Customer,
          notification_type:
            updateJobStatusDTO?.job_status === JobProgress.Completed
              ? NotificationType.Job_Completion_Accepted
              : NotificationType.Job_Completion_Rejected,
        };

        // Send notification function (assuming you have a notification service)
        await this.notificationHelperService.sendNotification(notificationDTO);
      }

      /*if (updateJobStatusDTO?.job_status === JobProgress.Completed) {
        // Add to customer wallet
        await this.customerWalletService.orderCompleted(
          '' + scheduledJob?.customer_id?._id,
          _id,
        );

        // Add to helper wallet
        await this.helperWalletService.orderCompleted(
          scheduledJob?.helper_id,
          _id,
        );
      }*/

      return { status: eAPIResultStatus.Success };
    } catch (error) {
      console.error('Error update customer rating:', error);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getOrderByHelperId(id: string) {
    const orders = await this.scheduledJobModel
      .find({
        helper_id: '' + id,
      })
      .populate([
        { path: 'customer_id', select: '_id alias_name' },
        {
          path: 'job_id',
          select:
            'price start_date end_date extended_start_date extended_end_date',
          populate: { path: 'main_job_id', select: 'main_job_name' },
        },
      ]);

    return orders;
  }

  async getJobCountsForCurrentYear(helperId: string) {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);

    const successJobCount = await this.scheduledJobModel.countDocuments({
      helper_id: helperId,
      job_status: JobProgress.Completed,
      createdAt: { $gte: startOfYear, $lte: endOfYear },
    });

    const failJobCount = await this.scheduledJobModel.countDocuments({
      helper_id: helperId,
      job_status: JobProgress.Cancel,
      createdAt: { $gte: startOfYear, $lte: endOfYear },
    });

    return { successJobCount, failJobCount };
  }

  async getOrderDetailsById(id: string) {
    const data = await this.scheduledJobModel
      .findById(id)
      .populate([
        {
          path: 'job_id',
          populate: [
            { path: 'address_id' },
            { path: 'sub_job_id', select: '_id sub_job_name' },
          ],
        },
        { path: 'customer_id', select: '_id profile_url alias_name' },
      ])
      .lean();

    return data;
  }

  async addCompletedJobData(
    createCompletedJobDTO: CreateCompletedJobDTO,
    _id: string,
  ): Promise<UpdateCustomerRatingResponseDTO> {
    try {
      const scheduledJob: any = await this.scheduledJobModel
        .findById(_id)
        .populate('helper_id', '_id profile_url');

      if (!scheduledJob) {
        return { status: eAPIResultStatus.Failure, invalidScheduleJobId: true };
      }

      const helperData: any = await this.userModel.findById(
        scheduledJob?.helper_id,
      );
      const defaultWarrantyPeriod = parseInt(helperData?.defaultWarrantyPeriod);
      const currentDate = new Date();
      const warrantyExpirationDate = new Date(
        currentDate.getTime() + defaultWarrantyPeriod * 24 * 60 * 60 * 1000,
      );

      await this.scheduledJobModel.updateOne(
        { _id: scheduledJob?._id },
        {
          $set: {
            completed_date: createCompletedJobDTO?.completed_date,
            completed_time_stamp: createCompletedJobDTO?.completed_time_stamp,
            media: createCompletedJobDTO?.media,
            description: createCompletedJobDTO?.description,
            job_status: createCompletedJobDTO?.status,
            warranty_expiration_date: warrantyExpirationDate,
          },
        },
      );

      //send notification to customer
      const notificationDTO = {
        image: scheduledJob?.helper_id?.profile_url,
        title: 'Job Completion Submitted',
        content: `The job has been marked as completed by the helper job_id : ${scheduledJob?._id}. Please review the submitted work and provide your response.`,
        sender_id: '' + scheduledJob?.helper_id?._id,
        receiver_id: scheduledJob?.customer_id,
        receiver_type: Role.Customer,
        sender_type: Role.Helper,
        notification_type: NotificationType.Job_Completion_Submitted,
      };

      await this.notificationCustomerService.sendNotification(notificationDTO);
      return { status: eAPIResultStatus.Success };
    } catch (error) {
      console.error('Error update customer rating:', error);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getScheduleJobById(
    id: string,
  ): Promise<UpdateCustomerRatingResponseDTO> {
    try {
      const scheduledJob = await this.scheduledJobModel.findById(id);
      if (!scheduledJob) {
        return { status: eAPIResultStatus.Failure, invalidScheduleJobId: true };
      }
      return { status: eAPIResultStatus.Success, data: scheduledJob };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getHelperIncomeAndLastJobDate(helper_id: string) {
    try {
      const completedJobs = await this.scheduledJobModel
        .find({
          $or: [
            {
              helper_id: helper_id,
              job_status: {
                $in: [JobProgress.Completed, JobProgress.Reviewed],
              },
            },
            {
              helper_id: new Types.ObjectId(helper_id),
              job_status: {
                $in: [JobProgress.Completed, JobProgress.Reviewed],
              },
            },
          ],
        })
        .sort({ completed_date: -1 })
        .populate('job_id', '_id price')
        .lean()
        .exec();

      if (!completedJobs || completedJobs.length === 0) {
        return {
          total_income: 0,
          last_completed_job_date: null,
        };
      }

      const total_income = completedJobs?.reduce((sum, job: any) => {
        return sum + (job?.job_id?.price || 0);
      }, 0);

      const last_completed_job_date = completedJobs[0]?.completed_date || null;

      return {
        total_income,
        last_completed_job_date,
      };
    } catch (error) {
      console.error('Error getting helper income and last job date:', error);
      throw new Error('Something went wrong');
    }
  }

  async getHelpersIncome(
    helper_ids: string[],
    startDate?: Date,
    endDate?: Date,
  ) {
    try {
      const helperIdConditions = helper_ids.map((id) => ({
        $or: [{ helper_id: id }, { helper_id: new Types.ObjectId(id) }],
      }));

      const queryConditions: any = {
        $or: helperIdConditions,
        job_status: {
          $in: [JobProgress.Completed, JobProgress.Reviewed],
        },
      };

      if (startDate && endDate) {
        queryConditions.completed_date = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      const completedJobs = await this.scheduledJobModel
        .find(queryConditions)
        .populate('job_id', '_id price')
        .lean()
        .exec();

      const total_income = completedJobs?.reduce((sum, job: any) => {
        return sum + (job?.job_id?.price || 0);
      }, 0);

      return {
        total_income,
      };
    } catch (error) {
      console.error('Error calculating helpers income:', error);
      throw new Error('Failed to calculate helpers income');
    }
  }

  async getHelperCompletedJobWithJobPrice(
    helper_id: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    try {
      const queryConditions: any = {
        $or: [{ helper_id }, { helper_id: new Types.ObjectId(helper_id) }],
        job_status: {
          $in: [JobProgress.Completed, JobProgress.Reviewed],
        },
      };

      if (startDate && endDate) {
        queryConditions.completed_date = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      const completedJobs = await this.scheduledJobModel
        .find(queryConditions)
        .populate([
          { path: 'job_id', select: '_id price' },
          { path: 'helper_id', select: 'id profile_name' },
        ])
        .lean()
        .exec();

      return completedJobs;
    } catch (error) {
      console.error('Error calculating helpers income:', error);
      throw new Error('Failed to calculate helpers income');
    }
  }
  async getHelpersUpcomingAndInProgressJobs(
    helper_ids: string[],
    startDate?: Date,
    endDate?: Date,
  ): Promise<any> {
    try {
      const helperIdConditions = helper_ids.map((id) => ({
        $or: [{ helper_id: id }, { helper_id: new Types.ObjectId(id) }],
      }));

      const queryConditions: any = {
        $or: helperIdConditions,
        job_status: {
          $in: [JobProgress.Pending, JobProgress.In_Progress],
        },
      };

      const pendingJobs = await this.scheduledJobModel
        .find(queryConditions)
        .populate([
          {
            path: 'helper_id',
            select: '_id profile_name profile_url',
          },
          {
            path: 'job_id',
            select:
              '_id start_date end_date extended_start_date extended_end_date start_time_stamp end_time_stamp ',
            match:
              startDate && endDate
                ? {
                    $or: [
                      {
                        $and: [
                          { extended_start_date: { $exists: false } },
                          { start_date: { $gte: startDate, $lte: endDate } },
                        ],
                      },
                      {
                        $and: [
                          { extended_start_date: { $exists: true } },
                          {
                            extended_start_date: {
                              $gte: startDate,
                              $lte: endDate,
                            },
                          },
                        ],
                      },
                    ],
                  }
                : undefined,
          },
        ])
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      if (!pendingJobs || pendingJobs.length === 0) {
        return [];
      }

      // Format response
      const formattedJobs = pendingJobs
        .map((job: any) => {
          if (!job?.job_id || !job?.helper_id) {
            return null;
          }

          return {
            _id: job._id,
            job_status: job.job_status,
            order_number: job.order_number,
            createdAt: job.createdAt,
            job_id: job.job_id._id,
            start_date: job.job_id.extended_start_date || job.job_id.start_date,
            end_date: job.job_id.extended_end_date || job.job_id.end_date,
            start_time_stamp: job?.job_id?.start_time_stamp,
            end_time_stamp: job?.job_id?.end_time_stamp,
            helper: {
              _id: job.helper_id._id,
              profile_name: job.helper_id.profile_name,
              profile_url: job.helper_id.profile_url,
            },
          };
        })
        .filter(Boolean);

      return formattedJobs;
    } catch (error) {
      console.error('Error getting helpers pending jobs:', error);
      throw new Error('Failed to fetch pending jobs: ' + error.message);
    }
  }
}

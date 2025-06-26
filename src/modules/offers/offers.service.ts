import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HelperOffer, HelperOfferDocument } from 'src/entitites/helper-offer';
import { SearchJob, SearchJobDocument } from 'src/entitites/search-job';
import { User, UserDocument } from 'src/entitites/user';
import { CreateHelperOfferRequestDTO } from './dtos/request/create-offer.dto';
import {
  eAPIResultStatus,
  JobProgress,
  NotificationType,
  OfferStatus,
  Role,
} from 'src/utils/enum';
import { CreateHelperOfferResponseDTO } from './dtos/response/create-offer.dto';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { UpdateHelperOfferResponseDTO } from './dtos/response/update-offer.dto';
import { UpdateHelperOfferRequestDTO } from './dtos/request/update-offer.dto';
import { NotificationHelperService } from '../../helper-modules/notification-helper/notification-helper.service';
import { NotificationHomeOwnerService } from 'src/home-owner-modules/home-owner-notification/home-owner-notification.service';
import { GetHelperOfferResponseDTO } from './dtos/response/get-offer-by-id.dto';
import { ScheduledJobService } from '../scheduled-job/scheduled-job.service';
import {
  ScheduledJob,
  ScheduledJobDocument,
} from 'src/entitites/scheduled-job';
import { getAvgRatingAndTotalRating } from 'src/utils/globalFunctions';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(SearchJob.name) private jobModel: Model<SearchJobDocument>,

    @InjectModel(HelperOffer.name)
    private offerModel: Model<HelperOfferDocument>,

    @InjectModel(User.name) private userModel: Model<UserDocument>,

    @InjectModel(ScheduledJob.name)
    private scheduledJobModel: Model<ScheduledJobDocument>,

    private readonly notificationHelperService: NotificationHelperService,
    private readonly notificationCustomerService: NotificationHomeOwnerService,

    private readonly scheduledJobService: ScheduledJobService,
  ) {}

  async create(
    createJobHelperDto: CreateHelperOfferRequestDTO,
    customer_id: string,
  ): Promise<CreateHelperOfferResponseDTO> {
    try {
      const { job_id, helper_id } = createJobHelperDto;

      const jobExists = await this.jobModel
        .findById({
          _id: job_id,
        })
        .populate({
          path: 'sub_job_id',
          select: 'job_descriptions',
        });
      if (!jobExists) {
        return { status: eAPIResultStatus.Failure, InvalidJobId: true };
      }

      const helperExists = await this.userModel.exists({
        _id: helper_id,
        role: Role.Helper,
      });
      if (!helperExists) {
        return { status: eAPIResultStatus.Failure, InvalidHelperId: true };
      }

      const {
        main_job_id,
        sub_job_id,
        address_id,
        media,
        price,
        start_date,
        time,
      } = jobExists;
      const { job_descriptions } = jobExists?.sub_job_id as any;

      const job_start_date = new Date(
        `${start_date.toISOString().split('T')[0]}T${time.toISOString().split('T')[1]}`,
      );

      const newHelperOffer = new this.offerModel({
        job_id,
        helper_id,
        main_job_id,
        sub_job_id,
        address_id,
        media,
        price,
        start_date: job_start_date,
        job_descriptions,
        status: OfferStatus.Pending,
        customer_id: jobExists?.customer_id,
        end_date: jobExists?.end_date,
        start_time_stamp: jobExists?.start_time_stamp,
        end_time_stamp: jobExists?.end_time_stamp,
      });

      const data = await newHelperOffer.save();

      const customer = await this.userModel.findOne(
        { _id: '' + customer_id, role: Role.Customer },
        { _id: 1, profile_url: 1 },
      );

      const notificationDTO = {
        image: customer?.profile_url,
        title: 'New Offer',
        content: 'You got new offer',
        sender_id: '' + customer?._id,
        receiver_id: helper_id,
        receiver_type: Role.Helper,
        sender_type: Role.Customer,
        notification_type: NotificationType.Offer_Sent,
      };

      await this.notificationHelperService.sendNotification(notificationDTO);
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }
  async getPendingOffersByHelperId(helper_id: string): Promise<ResponseDTO> {
    try {
      const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
      const data = await this.offerModel
        .find({
          helper_id,
          status: OfferStatus.Pending,
          createdAt: { $gte: threeMinutesAgo },
        })
        .populate([
          { path: 'helper_id', select: '-password' },
          { path: 'main_job_id', select: 'main_job_name' },
          { path: 'sub_job_id', select: 'sub_job_name' },
          { path: 'address_id' },
          { path: 'job_id', select: 'quantity' },
        ]);

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async updateStatusByOfferId(
    _id: string,
    updateHelperOfferRequestDTO: UpdateHelperOfferRequestDTO,
    user: any,
  ): Promise<UpdateHelperOfferResponseDTO> {
    try {
      if (user?.role === Role.Customer) {
        return { status: eAPIResultStatus.Failure, InvalidHelper: true };
      }

      const helperOffer = await this.offerModel.findById(_id).exec();

      if (!helperOffer) {
        return { status: eAPIResultStatus.Failure, InvalidOfferId: true };
      }

      helperOffer.status = updateHelperOfferRequestDTO.status;

      const data = await helperOffer.save();

      if (data?.status === OfferStatus.Accepted) {
        const helper = await this.userModel.findOne(
          { _id: '' + helperOffer?.helper_id, role: Role.Helper },
          { _id: 1, profile_url: 1 },
        );
        const notificationDTO = {
          image: helper?.profile_url,
          title: 'Offer Accepted',
          content: `Your offer id:${helperOffer?._id} is accepted by helper.`,
          sender_id: '' + helper?._id,
          receiver_id: '' + helperOffer?.customer_id,
          receiver_type: Role.Customer,
          sender_type: Role.Helper,
          notification_type: NotificationType.Offer_Accepted,
        };

        await this.notificationCustomerService.sendNotification(
          notificationDTO,
        );
      }

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getUpcomingAcceptedOffers(
    helperId: string,
    month: number,
    year: number,
  ): Promise<ResponseDTO> {
    try {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59);

      const data = await this.offerModel
        .find({
          helper_id: helperId,
          status: OfferStatus.Accepted,
          start_date: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        })
        .populate([
          { path: 'helper_id', select: '-password' },
          { path: 'main_job_id', select: 'main_job_name' },
          { path: 'sub_job_id', select: 'sub_job_name' },
          { path: 'address_id' },
          { path: 'job_id', select: 'quantity' },
        ]);
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      console.log('ERROR:: ', error.message);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getOfferById(
    _id: string,
    user: any,
  ): Promise<GetHelperOfferResponseDTO> {
    try {
      if (user?.role === Role.Helper) {
        return { status: eAPIResultStatus.Failure, InvalidCustomer: true };
      }

      const helperOffer = await this.offerModel
        .findById(_id)
        .populate([
          {
            path: 'helper_id',
            select: '-password',
          },
          {
            path: 'main_job_id',
            select: 'main_job_name',
          },
          { path: 'sub_job_id', select: 'sub_job_name' },
          { path: 'address_id' },
          { path: 'job_id', select: 'quantity' },
        ])
        .lean()
        .exec();

      if (!helperOffer) {
        return { status: eAPIResultStatus.Failure, InvalidOfferId: true };
      }

      const ratedJobs = await this.scheduledJobModel.find({
        helper_id: '' + helperOffer?.helper_id?._id,
        job_status: JobProgress.Reviewed,
      });

      const { totalNoOfRatedJobs, avgRating } =
        getAvgRatingAndTotalRating(ratedJobs);

      const orderNumber = (
        await this.scheduledJobModel.findOne({
          job_id: '' + helperOffer?.job_id?._id,
        })
      )?.order_number;

      return {
        status: eAPIResultStatus.Success,
        data: {
          ...helperOffer,
          totalNoOfRatedJobs,
          rating: avgRating || 0,
          orderNumber,
        },
      };
    } catch (error) {
      console.log('ERROR ::', error);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getFinancialChart(helper_id: string): Promise<ResponseDTO> {
    try {
      const totalOffers = await this.offerModel.countDocuments({ helper_id });

      if (totalOffers === 0) {
        return { status: eAPIResultStatus.Success, data: {} };
      }

      const { acceptedOffers, acceptedPercentage } =
        await this.getAcceptedJobsInPercentage(totalOffers, helper_id);

      const { acceptedJobs, succeedPercentage, currentMonthIncome } =
        await this.getSucceedJobsInPercentage(acceptedOffers, helper_id);

      const incomeByMonths = await this.getIncomeByMonths(
        helper_id,
        acceptedJobs,
      );

      return {
        status: eAPIResultStatus.Success,
        data: {
          acceptedPercentage,
          succeedPercentage,
          currentMonthIncome,
          incomeByMonths,
        },
      };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getAcceptedJobsInPercentage(totalOffers: number, helper_id: string) {
    const acceptedOffers = await this.offerModel.countDocuments({
      status: OfferStatus.Accepted,
      helper_id,
    });

    return {
      acceptedOffers,
      acceptedPercentage: ((acceptedOffers / totalOffers) * 100).toFixed(2),
    };
  }

  async getSucceedJobsInPercentage(acceptedOffers: number, helper_id: string) {
    const acceptedJobs = await this.offerModel
      .find({ status: OfferStatus.Accepted, helper_id })
      .populate({
        path: 'job_id',
        select: 'end_date extended_end_date price',
      })
      .lean();

    const now = new Date();

    const currentMonthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );

    const currentMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    let succeededJobs = 0;
    let currentMonthIncome = 0;

    acceptedJobs.forEach((offer: any) => {
      if (!offer?.job_id) return;

      const job = offer?.job_id;
      const endDate = new Date(job?.extended_end_date ?? job?.end_date);

      if (endDate < now) {
        succeededJobs++;

        if (endDate >= currentMonthStart && endDate <= currentMonthEnd) {
          currentMonthIncome += job?.price || 0;
        }
      }
    });

    const succeedPercentage =
      acceptedOffers > 0
        ? ((succeededJobs / acceptedOffers) * 100).toFixed(2)
        : '0.00';

    return { acceptedJobs, succeedPercentage, currentMonthIncome };
  }

  async getIncomeByMonths(helper_id: string, acceptedJobs: any) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const monthlyIncome: Record<string, number> = {};

    for (let month = 0; month <= currentMonth; month++) {
      const monthStart = new Date(currentYear, month, 1, 0, 0, 0, 0);
      const monthEnd = new Date(currentYear, month + 1, 0, 23, 59, 59, 999);
      let monthIncome = 0;

      acceptedJobs.forEach((offer: any) => {
        if (!offer?.job_id) return;

        const job = offer?.job_id;
        const endDate = new Date(job?.extended_end_date ?? job?.end_date);

        if (endDate < now) {
          if (endDate >= monthStart && endDate <= monthEnd) {
            monthIncome += job?.price || 0;
          }
        }
      });

      monthlyIncome[
        new Date(currentYear, month).toLocaleString('en-US', { month: 'short' })
      ] = monthIncome;
    }

    return monthlyIncome;
  }
}

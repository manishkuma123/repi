import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/entitites/user';
import { getAllHomeOwnersResponseDTO } from './dtos/response/get-all-home-owner.dto';
import { eAPIResultStatus, JobProgress, Role } from 'src/utils/enum';
import {
  HomeOwnerAddress,
  HomeOwnerAddressDocument,
} from 'src/entitites/home-owner-address';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import {
  ScheduledJob,
  ScheduledJobDocument,
} from 'src/entitites/scheduled-job';
import {
  HelperJobReview,
  HelperJobReviewDocument,
} from 'src/entitites/helper-job-review';

@Injectable()
export class HomeOwnerService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(HomeOwnerAddress.name)
    private homeOwnerAddressModel: Model<HomeOwnerAddressDocument>,

    @InjectModel(ScheduledJob.name)
    private ScheduledJobModel: Model<ScheduledJobDocument>,

    @InjectModel(HelperJobReview.name)
    private HelperJobReviewModel: Model<HelperJobReviewDocument>,
  ) {}

  async getAllHomeOwners(): Promise<getAllHomeOwnersResponseDTO> {
    try {
      const data = await this.userModel
        .find({ role: Role.Customer })
        .populate({ path: 'last_order_id', select: 'order_number' });
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getHomeOwnerById(id: string): Promise<ResponseDTO> {
    try {
      const data = await this.userModel.findById(id).lean();
      const addresses = await this.homeOwnerAddressModel.find({
        $or: [{ user_id: id }, { user_id: data?._id }],
      });
      const orders = await this.ScheduledJobModel.find({
        customer_id: '' + id,
      }).populate([
        {
          path: 'helper_id',
          select: '_id  trader_name alias_name profile_name',
        },
        {
          path: 'job_id',
          select:
            'price start_date end_date extended_start_date extended_end_date',
          populate: { path: 'main_job_id', select: 'main_job_name' },
        },
      ]);

      const { success, fail } = orders.reduce(
        (acc, order) => {
          order?.job_status === JobProgress.Cancel ? acc.fail++ : acc.success++;
          return acc;
        },
        { success: 0, fail: 0 },
      );

      return {
        status: eAPIResultStatus.Success,
        data: { ...data, addresses, orders, success, fail },
      };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getOrderDetailsById(id: string): Promise<ResponseDTO> {
    try {
      const data = await this.ScheduledJobModel.findById(id)
        .populate([
          {
            path: 'job_id',
            populate: [
              { path: 'address_id' },
              { path: 'sub_job_id', select: '_id sub_job_name' },
            ],
          },
          {
            path: 'helper_id',
            select: '_id  profile_url trader_name alias_name profile_name',
          },
        ])
        .lean();

      if (data?.job_status === JobProgress.Reviewed) {
        const homeOwnerReview = await this.HelperJobReviewModel.findOne({
          scheduled_job_id: id,
        });

        data['comment'] = homeOwnerReview?.additional_feedback;
      }
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }
}

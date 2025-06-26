import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HelperJobReview,
  HelperJobReviewDocument,
} from 'src/entitites/helper-job-review';
import {
  ScheduledJob,
  ScheduledJobDocument,
} from 'src/entitites/scheduled-job';
import { CreateHelperJobReviewResponseDTO } from './dtos/response/create-review.dto';
import { CreateHelperJobReviewDTO } from './dtos/request/create-review.dto';
import { eAPIResultStatus, JobProgress } from 'src/utils/enum';
import { CustomerWalletService } from 'src/modules/customer-wallet/customer-wallet.service';
import { HelperWalletService } from 'src/modules/helper-wallet/helper-wallet.service';

@Injectable()
export class HelperJobReviewService {
  constructor(
    @InjectModel(HelperJobReview.name)
    private readonly reviewModel: Model<HelperJobReviewDocument>,
    @InjectModel(ScheduledJob.name)
    private readonly scheduledJobModel: Model<ScheduledJobDocument>,

    private readonly customerWalletService: CustomerWalletService,
    private readonly helperWalletService: HelperWalletService,
  ) {}

  async createReview(
    createReviewData: CreateHelperJobReviewDTO,
  ): Promise<CreateHelperJobReviewResponseDTO> {
    try {
      const scheduled_job = await this.scheduledJobModel.findById(
        createReviewData?.scheduled_job_id,
      );

      if (!scheduled_job) {
        return {
          status: eAPIResultStatus.Failure,
          invalidScheduledJobId: true,
        };
      }
      const newReview = new this.reviewModel({
        ...createReviewData,
        customer_id: scheduled_job?.customer_id,
        helper_id: scheduled_job?.helper_id,
      });
      const data = await newReview.save();

      //update scheduled-job status
      const {
        punctual_rating,
        courteous_rating,
        efficient_rating,
        productive_rating,
      } = createReviewData;

      const total_rating =
        0.15 * punctual_rating +
        0.15 * courteous_rating +
        0.2 * efficient_rating +
        0.5 * productive_rating;

      const updateScheduledJob = await this.scheduledJobModel.updateOne(
        { _id: '' + scheduled_job?._id },
        { $set: { job_status: JobProgress.Reviewed, total_rating } },
      );

      // order completed to customer wallet
      await this.customerWalletService.orderCompleted(
        '' + scheduled_job?.customer_id,
        '' + scheduled_job?._id,
      );

      // order completed to helper wallet
      await this.helperWalletService.orderCompleted(
        '' + scheduled_job?.helper_id,
        '' + scheduled_job?._id,
      );

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async helperCustomerListWithRatingById(helper_id: string) {
    const data = await this.reviewModel
      .find({
        helper_id,
      })
      .populate([
        { path: 'customer_id' },
        { path: 'scheduled_job_id', select: 'total_rating' },
      ]);

    return data;
  }
}

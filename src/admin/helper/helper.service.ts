import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { User, UserDocument } from 'src/entitites/user';
import { CertificatesService } from 'src/helper-modules/certificates/certificates.service';
import { SkilHelperService } from 'src/helper-modules/expertise-helper/skill-helper.service';
import { GeoLocationService } from 'src/helper-modules/geo-location/geo-location.service';
import { ScheduledJobService } from 'src/modules/scheduled-job/scheduled-job.service';
import { eAPIResultStatus, Role } from 'src/utils/enum';

@Injectable()
export class HelperService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    private readonly helperLocationService: GeoLocationService,
    private readonly helperCertificateService: CertificatesService,
    private readonly helperSkillService: SkilHelperService,
    private readonly scheduleJobService: ScheduledJobService,

    // @InjectModel(ScheduledJob.name)
    // private ScheduledJobModel: Model<ScheduledJobDocument>,

    // @InjectModel(HelperJobReview.name)
    // private HelperJobReviewModel: Model<HelperJobReviewDocument>,
  ) {}

  async getAllHelpers(): Promise<ResponseDTO> {
    try {
      const data = await this.userModel
        .find({ role: Role.Helper })
        .populate({ path: 'last_order_id', select: 'order_number ' });
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getHelperDetailsById(id: string): Promise<ResponseDTO> {
    try {
      const helper = await this.userModel.findById(id).lean();
      const location = await this.helperLocationService.getHelperLocation(id);
      const certificates =
        await this.helperCertificateService.getAllAcceptedCertificatesByHelperId(
          id,
        );
      const skills =
        await this.helperSkillService.getAllSkillNameByHelperId(id);

      const orders = await this.scheduleJobService.getOrderByHelperId(id);

      const { successJobCount, failJobCount } =
        await this.scheduleJobService.getJobCountsForCurrentYear(id);
      return {
        status: eAPIResultStatus.Success,
        data: {
          ...helper,
          location,
          certificates,
          skills,
          orders,
          successJobCount,
          failJobCount,
        },
      };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getOrderDetailsById(id: string): Promise<ResponseDTO> {
    try {
      const data = await this.scheduleJobService.getOrderDetailsById(id);

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }
}

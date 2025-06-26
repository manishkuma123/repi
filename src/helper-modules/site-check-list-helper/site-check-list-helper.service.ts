import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SiteCheckListHelper } from './entities/site-check-list-helper.entity';
import { Model } from 'mongoose';
import { CreateSiteCheckListHelperDTO } from './dtos/request/create-site-check-list-helper.dto';
import { CreateSiteCheckListHelperResponseDTO } from './dtos/response/create-site-check-list-helper.dto';
import { eAPIResultStatus } from 'src/utils/enum';
import { GetAllSiteCheckListByMainAndSubJobIdResponseDTO } from './dtos/response/get-all-site-check-list-by-main-and-sub-job-id';

@Injectable()
export class SiteCheckListHelperService {
  constructor(
    @InjectModel(SiteCheckListHelper.name)
    private readonly siteCheckListHelperModel: Model<SiteCheckListHelper>,
  ) {}

  async create(
    createSiteCheckListDto: CreateSiteCheckListHelperDTO,
  ): Promise<CreateSiteCheckListHelperResponseDTO> {
    try {
      const record = new this.siteCheckListHelperModel(createSiteCheckListDto);
      await record.save();
      return { status: eAPIResultStatus.Success };
    } catch (error) {
      return { status: eAPIResultStatus.Failure, message: error.message };
    }
  }

  async findByMainJobAndSubJob(
    mainJobId: string,
    subJobId: string,
  ): Promise<GetAllSiteCheckListByMainAndSubJobIdResponseDTO> {
    try {
      const data = await this.siteCheckListHelperModel.find({
        mainJobId,
        subJobId,
      });
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure, message: error.message };
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { eAPIResultStatus } from 'src/utils/enum';
import { SubJob, SubJobDocument } from 'src/entitites/sub-job';
import { CreateSubJobRequestDTO } from 'src/dtos/sub-job/request/create-sub-job.dto';
import { CreateSubJobResponseDTO } from 'src/dtos/sub-job/response/create-sub-job.dto';
import { GetByMainJobIdResponseDTO } from 'src/dtos/sub-job/response/get-all-sub-job-by-main-job-id.dto';
import { CustomValidationException } from 'src/customExceptions/validation-exception';

@Injectable()
export class SubJobService {
  constructor(
    @InjectModel(SubJob.name)
    private subJobModel: Model<SubJobDocument>,
  ) {}
  async create(
    createSubJobRequestDTO: CreateSubJobRequestDTO,
  ): Promise<CreateSubJobResponseDTO> {
    try {
      const createdsubJobsHelper = new this.subJobModel(createSubJobRequestDTO);
      const data = await createdsubJobsHelper.save();
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      throw new CustomValidationException(error.message);
    }
  }
  async findAll(id: any): Promise<GetByMainJobIdResponseDTO> {
    try {
      const data = await this.subJobModel.find({
        main_job_id: id,
      });
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      throw new CustomValidationException(error.message);
    }
  }

  async findById(id: any): Promise<CreateSubJobResponseDTO> {
    try {
      const data = await this.subJobModel.findById(id);
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      throw new CustomValidationException(error.message);
    }
  }

  async getJobIdsByName(keyword: string) {
    const matchingSubJobs = (await this.subJobModel
      .find(
        { $text: { $search: keyword } },
        {
          score: { $meta: 'textScore' },
          _id: 1,
        },
      )
      .lean()
      .exec()) as any[];

    const subJobIds = [];
    const subJobIdsAndScore = {};

    for (const subJob of matchingSubJobs) {
      subJobIds.push('' + subJob?._id);
      subJobIdsAndScore['' + subJob?._id] = subJob['score'];
    }

    return { subJobIdsAndScore, subJobIds };
  }

  async deleteAllSubJobs() {
    try {
      await this.subJobModel.deleteMany({});

      return { status: eAPIResultStatus.Success };
    } catch (error) {
      return { status: eAPIResultStatus.Failure, error: error.message };
    }
  }
}

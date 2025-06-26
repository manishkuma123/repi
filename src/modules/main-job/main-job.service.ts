import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { eAPIResultStatus } from 'src/utils/enum';
import { MainJob, MainJobDocument } from 'src/entitites/main-job';
import { CreateMainJobResponseDTO } from 'src/dtos/main-job/response/create-main-job-dto';
import { CreateMainJobRequestDTO } from 'src/dtos/main-job/request/create-main-job.dto';
import { CustomValidationException } from 'src/customExceptions/validation-exception';
import { GetAllMainJobResponseDTO } from 'src/dtos/main-job/response/get-all-main-job.dto';
import { SubJob, SubJobDocument } from 'src/entitites/sub-job';
import { ResponseDTO } from 'src/dtos/general-response/general-response';

@Injectable()
export class MainJobService {
  constructor(
    @InjectModel(MainJob.name)
    private mainJobModel: Model<MainJobDocument>,

    @InjectModel(SubJob.name)
    private subJobModel: Model<SubJobDocument>,
  ) {}

  async create(
    createMainJobDto: CreateMainJobRequestDTO,
  ): Promise<CreateMainJobResponseDTO> {
    try {
      const createdMainJobsHelper = new this.mainJobModel(createMainJobDto);
      const record = await createdMainJobsHelper.save();

      return { status: eAPIResultStatus.Success, data: record };
    } catch (error) {
      throw new CustomValidationException(error.message);
    }
  }

  async findAll(): Promise<GetAllMainJobResponseDTO> {
    try {
      const data = await this.mainJobModel.find();
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async findAllWithJobs(): Promise<GetAllMainJobResponseDTO> {
    try {
      const data = await this.mainJobModel.find();
      const result = [];

      for (const dataItem of data) {
        const subJobData = await this.subJobModel
          .find({
            main_job_id: dataItem._id.toString(),
          })
          .select('_id, sub_job_name');

        result.push({ ...dataItem.toObject(), sub_jobs: subJobData });
      }
      return { status: eAPIResultStatus.Success, data: result };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getMainJobById(id: string): Promise<ResponseDTO> {
    try {
      const data = await this.mainJobModel.findById(id);
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getJobIdsByName(keyword: string) {
    const matchingMainJobs = (await this.mainJobModel
      .find(
        { $text: { $search: keyword } },
        {
          score: { $meta: 'textScore' },
          _id: 1,
        },
      )
      .lean()
      .exec()) as any[];

    const mainJobIds = [];
    const mainJobIdsScore = {};

    for (const mainJob of matchingMainJobs) {
      mainJobIds.push('' + mainJob?._id);
      mainJobIdsScore['' + mainJob?._id] = mainJob['score'];
    }

    return { mainJobIdsScore, mainJobIds };
  }

  async deleteAllMainJobsAndSubJobs() {
    try {
      await this.mainJobModel.deleteMany({});
      await this.subJobModel.deleteMany({});

      return { status: eAPIResultStatus.Success };
    } catch (error) {
      console.log(error);
      return { status: eAPIResultStatus.Failure, error: error.message };
    }
  }
}

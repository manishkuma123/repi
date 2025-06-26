import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HelperTrainingList,
  HelperTrainingListDocument,
} from 'src/entitites/helper-training-list';
import { CreateHelperTrainingListRequestDTO } from './dtos/request/create.dto';
import { CreateHelperTrainingListResponsetDTO } from './dtos/response/create.dto';
import { eAPIResultStatus, Role } from 'src/utils/enum';
import { AuthGuard } from '../guards/AuthGuard';
import { MainJob, MainJobDocument } from 'src/entitites/main-job';
import { SubJob, SubJobDocument } from 'src/entitites/sub-job';
import { v4 as uuidv4 } from 'uuid';
import { UserDocument } from 'src/entitites/user';
import { GetHelperTraningListResponseDTO } from './dtos/response/getHelperTrainingList.dto';
import { HelperSkill, HelperSkillDocument } from 'src/entitites/helper-skills';

@Injectable()
@UseGuards(AuthGuard)
export class HelperTrainingListService {
  constructor(
    @InjectModel(HelperTrainingList.name)
    private helperTrainingListModel: Model<HelperTrainingListDocument>,

    @InjectModel(MainJob.name)
    private mainJobModel: Model<MainJobDocument>,

    @InjectModel(SubJob.name)
    private subJobModel: Model<SubJobDocument>,

    @InjectModel(HelperSkill.name)
    private helperSkillModel: Model<HelperSkillDocument>,
  ) {}

  async create(
    createDto: CreateHelperTrainingListRequestDTO,
  ): Promise<CreateHelperTrainingListResponsetDTO> {
    try {
      const { main_job_id, sub_job_id, sessions } = createDto;
      const main_job = await this.mainJobModel.findById(main_job_id);
      const sub_job = await this.subJobModel.findById(sub_job_id);

      //if helper have already this sub-Job as skill
      const sessionsIds = {};

      for (const session of sessions) {
        const session_id = uuidv4().toString();
        sessionsIds[session_id] = false;
        session.session_id = session_id;
      }

      //create new training
      const newHelperTrainingList = new this.helperTrainingListModel({
        ...createDto,
        main_job_name: main_job?.main_job_name?.en,
        sub_job_name: sub_job?.sub_job_name?.en,
      });
      const data = await newHelperTrainingList.save();

      //if helper have already this sub-Job as skill
      await this.helperSkillModel.updateMany(
        {
          main_job_id,
          sub_job_id,
        },
        { $set: { trainings: sessionsIds } },
      );

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      console.log(error);
      return { status: eAPIResultStatus.Failure, validationError: true };
    }
  }

  async getHelperTrainingList(
    user: Partial<UserDocument>,
  ): Promise<GetHelperTraningListResponseDTO> {
    try {
      if (user?.role !== Role.Helper) {
        return { status: eAPIResultStatus.Failure, inValidHelper: true };
      }

      const helperSkills = await this.helperSkillModel
        .find({
          helper_id: '' + user?._id,
        })
        .sort({ main_job_id: 1, sub_job_id: 1 })
        .lean();

      const result = [];

      for (const helperSkill of helperSkills) {
        const session = await this.helperTrainingListModel.findOne({
          main_job_id: '' + helperSkill.main_job_id,
          sub_job_id: '' + helperSkill.sub_job_id,
        });
        if (session) {
          result.push({
            ...helperSkill,
            ...session?.toObject(),
            sessionStatus: helperSkill?.trainings,
            helperSkillId: helperSkill?._id,
          });
        } else {
          result.push({
            ...helperSkill,
            helperSkillId: helperSkill?._id,
          });
        }
      }

      return { status: eAPIResultStatus.Success, data: result };
    } catch (error) {
      console.log(error);
      return { status: eAPIResultStatus.Failure };
    }
  }
}

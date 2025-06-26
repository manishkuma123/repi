import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSkillsHelperResponseDTO } from './dtos/response/create-expertise-helper.dto';
import { eAPIResultStatus, JobStatus, Role } from 'src/utils/enum';
import { HelperSkill, HelperSkillDocument } from 'src/entitites/helper-skills';
import { CreateSkillsHelperDTO } from './dtos/request/create-expertise-helper.dto';
import {
  HelperTrainingList,
  HelperTrainingListDocument,
} from 'src/entitites/helper-training-list';
import { UpdateSkillsHelperDTO } from './dtos/request/update-expertises-helper.dto';
import { UpdateSkillHelperDTO } from './dtos/request/update-expertise-helper.dto';
import { UpdateSkillHelperResponseDTO } from './dtos/response/update-expertise-helper.dto';
import { User, UserDocument } from 'src/entitites/user';
import {
  CorporateSkill,
  CorporateSkillDocument,
} from 'src/entitites/corporate-skills';

@Injectable()
export class SkilHelperService {
  constructor(
    @InjectModel(HelperSkill.name)
    private helperSkillModel: Model<HelperSkillDocument>,

    @InjectModel(HelperTrainingList.name)
    private helperTrainingListModel: Model<HelperTrainingListDocument>,

    @InjectModel(CorporateSkill.name)
    private corporateSkillModel: Model<CorporateSkillDocument>,
  ) {}

  async createSkill(
    createSkillsHelperDTO: CreateSkillsHelperDTO,
    user: UserDocument,
  ): Promise<CreateSkillsHelperResponseDTO> {
    try {
      const { skills } = createSkillsHelperDTO;
      const helper_id = '' + user?._id;

      if (user?.role == Role.Corporator) {
        for (const skill of skills) {
          const { main_job_id, sub_job_id } = skill;
          for (const id of sub_job_id) {
            const existing_skill = await this.corporateSkillModel.findOne({
              corporate_id: helper_id,
              main_job_id,
              sub_job_id: id,
            });

            if (existing_skill) {
              continue;
            }

            const record = new this.corporateSkillModel({
              corporate_id: helper_id,
              main_job_id,
              sub_job_id: id,
            });

            await record.save();
          }
        }
      } else {
        for (const skill of skills) {
          const { main_job_id, sub_job_id } = skill;
          for (const id of sub_job_id) {
            const existing_skill = await this.helperSkillModel.findOne({
              helper_id,
              main_job_id,
              sub_job_id: id,
            });

            if (existing_skill) {
              continue;
            }

            const trainingList = await this.helperTrainingListModel.findOne({
              main_job_id,
              sub_job_id: id,
            });
            const trainings = {};

            if (trainingList && trainingList.sessions) {
              for (const session of trainingList.sessions) {
                trainings[session?.session_id] = false;
              }
            }

            const record = new this.helperSkillModel({
              helper_id,
              main_job_id,
              sub_job_id: id,
              trainings,
            });

            await record.save();
          }
        }
      }

      return { status: eAPIResultStatus.Success };
    } catch (error) {
      console.log(error);

      return { status: eAPIResultStatus.Failure };
    }
  }

  async getAllByHelperId(helper_id: string) {
    try {
      return this.helperSkillModel.find({ helper_id });
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async updateSkill(
    updateSkillsHelperDTO: UpdateSkillsHelperDTO,
    user: UserDocument,
  ) {
    try {
      const helper_id = user?._id;
      if (updateSkillsHelperDTO?.skills) {
        const createNewSkillsDTO = {
          skills: updateSkillsHelperDTO?.skills,
        };
        await this.createSkill(createNewSkillsDTO, user);
      }

      if (updateSkillsHelperDTO?.removeSkillsIds) {
        for (const id of updateSkillsHelperDTO?.removeSkillsIds) {
          await this.deleteSkill(id);
        }
      }

      return { status: eAPIResultStatus.Success };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async deleteSkill(skillId: string) {
    const deletedSkill = await this.helperSkillModel.findOne({
      _id: skillId,
    });
    if (deletedSkill) {
      await this.helperSkillModel.deleteOne({ _id: skillId });
    }

    return;
  }

  async getAllSkillNameByHelperId(helper_id: string) {
    const skills = await this.helperSkillModel
      .find({ helper_id })
      .populate('sub_job_id', 'sub_job_name');
    return skills;
  }

  async updateSkillById(
    updateSkillHelperDTO: UpdateSkillHelperDTO,
    _id: string,
    helper_id: string,
  ): Promise<UpdateSkillHelperResponseDTO> {
    try {
      const existingSkill = await this.helperSkillModel.findOne({
        _id: new Types.ObjectId(_id),
      });

      if (!existingSkill) {
        return { status: eAPIResultStatus.Failure, invalidSkillId: true };
      }

      await this.helperSkillModel.updateOne(
        { _id: new Types.ObjectId(_id) },
        { $set: { is_enabled: updateSkillHelperDTO?.is_enabled } },
      );

      return { status: eAPIResultStatus.Success };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getApprovedAndEnabledSkillsByHelperId(helper_id: string) {
    return await this.helperSkillModel
      .find({
        helper_id,
        is_enabled: true,
        job_status: JobStatus.Approved,
      })
      .populate('sub_job_id', 'sub_job_name');
  }
}

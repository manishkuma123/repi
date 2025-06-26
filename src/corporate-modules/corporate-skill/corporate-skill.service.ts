import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import {
  CorporateSkill,
  CorporateSkillDocument,
} from 'src/entitites/corporate-skills';
import { eAPIResultStatus } from 'src/utils/enum';

@Injectable()
export class CorporateSkillService {
  constructor(
    @InjectModel(CorporateSkill.name)
    private corporateSkillModel: Model<CorporateSkillDocument>,
  ) {}

  async getSkillsByCorporateId(corporateId: string): Promise<ResponseDTO> {
    try {
      const skills = await this.corporateSkillModel
        .find({
          corporate_id: corporateId,
          is_enabled: true,
        })
        .populate('main_job_id', 'main_job_name')
        .populate('sub_job_id', 'sub_job_name')
        .lean();

      const grouped = {};

      for (const skill of skills as any[]) {
        const mainJobId = skill.main_job_id?._id.toString();

        if (!grouped[mainJobId]) {
          grouped[mainJobId] = {
            main_job_id: skill.main_job_id?._id,
            main_job_name: skill.main_job_id?.main_job_name,
            sub_jobs: [],
          };
        }

        grouped[mainJobId].sub_jobs.push({
          _id: skill.sub_job_id._id,
          sub_job_name: skill.sub_job_id.sub_job_name,
        });
      }

      const result = Object.values(grouped);
      return { status: eAPIResultStatus.Success, data: result };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  // get all data
  async getAllCorporateSkills(): Promise<ResponseDTO> {
    try {
      const skills = await this.corporateSkillModel
        .find()
        .populate('main_job_id', 'main_job_name')
        .populate('sub_job_id', 'sub_job_name')
        .lean();

      return { status: eAPIResultStatus.Success, data: skills };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getAllSkillNameByCorporatorId(corporate_id: string) {
    const skills = await this.corporateSkillModel
      .find({ corporate_id })
      .populate('sub_job_id', 'sub_job_name');
    return skills;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  HelperTrainingExam,
  HelperTrainingExamDocument,
} from 'src/entitites/helper-training-exam';
import { CreateHelperTrainingExamRequestDTO } from './dtos/request/create.dto';
import { CreateHelperTrainingExamResponseDTO } from './dtos/response/create.dto';
import { eAPIResultStatus, JobStatus, Role, Steps } from 'src/utils/enum';
import { v4 as uuidv4 } from 'uuid';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { SubmitExamAnswersRequestDTO } from './dtos/request/submit-exam-answers.dto';
import { SubmitExamAnswersResponseDTO } from './dtos/response/submit-exam-answer.dto';
import { HelperSkill, HelperSkillDocument } from 'src/entitites/helper-skills';
import { User, UserDocument } from 'src/entitites/user';
import {
  InvitedHelper,
  InvitedHelperDocument,
} from 'src/entitites/invited-helpers';

@Injectable()
export class HelperTrainingExamService {
  constructor(
    @InjectModel(HelperTrainingExam.name)
    private helperTrainingExamModel: Model<HelperTrainingExamDocument>,

    @InjectModel(HelperSkill.name)
    private helperSkillModel: Model<HelperSkillDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(InvitedHelper.name)
    private invitedHelperModel: Model<InvitedHelperDocument>,
  ) {}

  async create(
    createDto: CreateHelperTrainingExamRequestDTO,
  ): Promise<CreateHelperTrainingExamResponseDTO> {
    try {
      const { tests } = createDto;

      for (const test of tests) {
        test.test_id = uuidv4().toString();
      }

      const newExam = new this.helperTrainingExamModel(createDto);
      await newExam.save();
      return { status: eAPIResultStatus.Success };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async findBySessionId(sessionId: string): Promise<ResponseDTO> {
    try {
      const data = await this.helperTrainingExamModel
        .findOne({ session_id: sessionId })
        .select('-tests.answer')
        .exec();

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async submitAnswers(
    submitExamAnswersRequestDTO: SubmitExamAnswersRequestDTO,
    helper: Partial<UserDocument>,
  ): Promise<SubmitExamAnswersResponseDTO> {
    try {
      if (helper.role !== Role.Helper) {
        return { status: eAPIResultStatus.Failure, inValidHelper: true };
      }

      const { session_id, testWithAnswer, sub_job_id, main_job_id } =
        submitExamAnswersRequestDTO;
      const { tests } = await this.helperTrainingExamModel.findOne({
        session_id,
      });

      for (const test of tests) {
        const { answer } = testWithAnswer.find(
          (data) => data.test_id.toString() === test.test_id.toString(),
        );
        if (test.answer !== +answer) {
          return { status: eAPIResultStatus.Success, isPassed: false };
        }
      }

      const helperSkill = (await this.helperSkillModel.findOneAndUpdate(
        { main_job_id, sub_job_id, helper_id: helper._id },
        {
          $set: { [`trainings.${session_id}`]: true },
        },
        { new: true },
      )) as any;

      // Check if all values in the `trainings` field are `true`
      if (
        helperSkill &&
        Array.from(helperSkill.trainings.values()).every(
          (status) => status === true,
        )
      ) {
        const existingApprovedHelperSkill = await this.helperSkillModel.findOne(
          {
            helper_id: helper._id,
            job_status: JobStatus.Approved,
          },
        );

        await this.helperSkillModel.updateOne(
          { main_job_id, sub_job_id, helper_id: helper._id },
          { $set: { job_status: JobStatus.Approved } },
        );

        if (!existingApprovedHelperSkill) {
          const updateObject: any = {
            $set: {
              step: Steps?.Completed,
            },
            $inc: { points: 200 },
          };
          await this.userModel.updateOne({ _id: helper?._id }, updateObject);

          const corporateHelper = await this.invitedHelperModel.findOne({
            country_code: helper?.country_code,
            phone_no: helper?.phone_no,
          });

          //  add points to his/her corporator
          if (corporateHelper) {
            await this.userModel.updateOne(
              { _id: new Types.ObjectId(corporateHelper?.corporator_id) },
              { $inc: { points: 200 } },
            );
          }
        }
      }

      return { status: eAPIResultStatus.Success, isPassed: true };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }
}

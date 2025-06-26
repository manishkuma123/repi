import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { User, UserDocument } from 'src/entitites/user';
import { ScheduledJobService } from 'src/modules/scheduled-job/scheduled-job.service';
import { eAPIResultStatus, Role, Steps } from 'src/utils/enum';
import { getRandomHelperJobs } from 'src/utils/globalFunctions';

@Injectable()
export class TeamPerformanceService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly scheduledJobService: ScheduledJobService,
  ) {}

  async getCorporateRevenue(
    corporate_id: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    try {
      const corporator = await this.userModel.findById(corporate_id);

      if (!corporator) {
        return {
          status: eAPIResultStatus.Failure,
          message: 'Corporate not found',
        };
      }

      const helpers = await this.userModel.find({
        corporate_id: corporate_id,
        role: Role.Helper,
      });

      if (!helpers || helpers.length === 0) {
        return {
          status: eAPIResultStatus.Success,
          data: corporator?.points || 0,
        };
      }

      const helper_ids = helpers.map((h) => h._id.toString());

      const helpersIncome = await this.scheduledJobService.getHelpersIncome(
        helper_ids,
        startDate,
        endDate,
      );

      let totalPoints = 0;
      if (startDate && endDate) {
        const registeredHelpers = helpers.filter((h: any) => {
          const registerDate = new Date(h.registered_date);
          return registerDate >= startDate && registerDate <= endDate;
        });
        totalPoints = registeredHelpers.reduce(
          (sum, helper) => sum + (helper.points || 0),
          0,
        );

        //add corporator's points based on their step
        const corporateRegisterDate = new Date(corporator?.registered_date);
        if (
          corporateRegisterDate >= startDate &&
          corporateRegisterDate <= endDate
        ) {
          if (corporator?.step == Steps.Second) {
            totalPoints += 200;
          } else if (corporator?.step == Steps.Completed) {
            totalPoints += 400;
          }
        }
      } else {
        totalPoints = helpers.reduce(
          (sum, helper) => sum + (helper.points || 0),
          0,
        );

        if (corporator?.step == Steps.Second) {
          totalPoints += 200;
        } else if (corporator?.step == Steps.Completed) {
          totalPoints += 400;
        }
      }

      const total_revenue = helpersIncome?.total_income + totalPoints;
      return {
        status: eAPIResultStatus.Success,
        data: total_revenue,
      };
    } catch (error) {
      console.error('Error calculating corporate revenue:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Error calculating corporate revenue',
      };
    }
  }

  async getTrendingIncome(
    corporate_id: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ResponseDTO> {
    try {
      const corporator = await this.userModel.findById(corporate_id);

      if (!corporator) {
        return {
          status: eAPIResultStatus.Failure,
          message: 'Corporate not found',
        };
      }

      const helpers = await this.userModel.find({
        corporate_id: corporate_id,
        role: Role.Helper,
      });

      if (!helpers || helpers.length === 0) {
        return {
          status: eAPIResultStatus.Success,
          data: [],
        };
      }

      const results = await Promise.all(
        helpers.map(async (helper) => {
          const completedJobs =
            await this.scheduledJobService.getHelperCompletedJobWithJobPrice(
              helper._id.toString(),
              startDate,
              endDate,
            );

          if (!completedJobs || completedJobs?.length === 0) {
            return null;
          }

          return completedJobs;
        }),
      );

      const data = results.filter((item) => item !== null);

      return {
        status: eAPIResultStatus.Success,
        data,
      };
    } catch (error) {
      console.error('Error fetching trending income:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Error fetching trending income',
      };
    }
  }
}

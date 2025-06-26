import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { User, UserDocument } from 'src/entitites/user';
import { ScheduledJobService } from 'src/modules/scheduled-job/scheduled-job.service';
import { eAPIResultStatus, Role } from 'src/utils/enum';
import { getRandomJobs } from 'src/utils/globalFunctions';

@Injectable()
export class CalenderService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly scheduledJobService: ScheduledJobService,
  ) {}
  async getUpcomingAndInProgressJobsForCalender(
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

      // const helpers = await this.userModel.find({
      //   corporate_id: corporate_id,
      //   role: Role.Helper,
      // });

      // if (!helpers || helpers.length === 0) {
      //   return {
      //     status: eAPIResultStatus.Success,
      //     data: [],
      //   };
      // }

      // const helpersIds = helpers.map((helper) => helper._id.toString());

      // const data =
      //   await this.scheduledJobService.getHelpersUpcomingAndInProgressJobs(
      //     helpersIds,
      //     startDate,
      //     endDate,
      //   );

      const dummyJobs = [
        {
          _id: 'job_001',
          job_status: 'pending',
          order_number: '10020001',
          createdAt: '2025-01-20T10:00:00.000Z',
          job_id: 'job_ref_001',
          start_date: '2025-02-01T08:00:00.000Z',
          end_date: '2025-02-01T11:00:00.000Z',
          start_time_stamp: 1738406400000,
          end_time_stamp: 1738417200000,
          helper: {
            _id: 'helper_001',
            profile_name: 'helper_one',
            profile_url: 'https://example.com/profile/helper_one',
          },
        },
        {
          _id: 'job_002',
          job_status: 'in_progress',
          order_number: '10020002',
          createdAt: '2025-02-18T09:30:00.000Z',
          job_id: 'job_ref_002',
          start_date: '2025-03-01T14:00:00.000Z',
          end_date: '2025-03-01T17:00:00.000Z',
          start_time_stamp: 1740991200000,
          end_time_stamp: 1741002000000,
          helper: {
            _id: 'helper_002',
            profile_name: 'helper_two',
            profile_url: 'https://example.com/profile/helper_two',
          },
        },
        {
          _id: 'job_003',
          job_status: 'pending',
          order_number: '10020003',
          createdAt: '2025-03-15T12:00:00.000Z',
          job_id: 'job_ref_003',
          start_date: '2025-04-05T09:00:00.000Z',
          end_date: '2025-04-05T12:00:00.000Z',
          start_time_stamp: 1743849600000,
          end_time_stamp: 1743860400000,
          helper: {
            _id: 'helper_003',
            profile_name: 'helper_three',
            profile_url: 'https://example.com/profile/helper_three',
          },
        },
        {
          _id: 'job_004',
          job_status: 'in_progress',
          order_number: '10020004',
          createdAt: '2025-04-10T15:15:00.000Z',
          job_id: 'job_ref_004',
          start_date: '2025-05-06T10:00:00.000Z',
          end_date: '2025-05-06T13:00:00.000Z',
          start_time_stamp: 1746535200000,
          end_time_stamp: 1746546000000,
          helper: {
            _id: 'helper_004',
            profile_name: 'helper_four',
            profile_url: 'https://example.com/profile/helper_four',
          },
        },
        {
          _id: 'job_005',
          job_status: 'pending',
          order_number: '10020005',
          createdAt: '2025-05-05T08:00:00.000Z',
          job_id: 'job_ref_005',
          start_date: '2025-06-07T13:00:00.000Z',
          end_date: '2025-06-07T15:00:00.000Z',
          start_time_stamp: 1749368400000,
          end_time_stamp: 1749375600000,
          helper: {
            _id: 'helper_005',
            profile_name: 'helper_five',
            profile_url: 'https://example.com/profile/helper_five',
          },
        },
        {
          _id: 'job_006',
          job_status: 'in_progress',
          order_number: '10020006',
          createdAt: '2025-06-12T11:45:00.000Z',
          job_id: 'job_ref_006',
          start_date: '2025-07-08T09:30:00.000Z',
          end_date: '2025-07-08T11:30:00.000Z',
          start_time_stamp: 1751957400000,
          end_time_stamp: 1751964600000,
          helper: {
            _id: 'helper_006',
            profile_name: 'helper_six',
            profile_url: 'https://example.com/profile/helper_six',
          },
        },
        {
          _id: 'job_007',
          job_status: 'pending',
          order_number: '10020007',
          createdAt: '2025-07-01T07:20:00.000Z',
          job_id: 'job_ref_007',
          start_date: '2025-08-09T16:00:00.000Z',
          end_date: '2025-08-09T18:00:00.000Z',
          start_time_stamp: 1754726400000,
          end_time_stamp: 1754733600000,
          helper: {
            _id: 'helper_007',
            profile_name: 'helper_seven',
            profile_url: 'https://example.com/profile/helper_seven',
          },
        },
        {
          _id: 'job_008',
          job_status: 'in_progress',
          order_number: '10020008',
          createdAt: '2025-08-11T10:10:00.000Z',
          job_id: 'job_ref_008',
          start_date: '2025-09-10T10:00:00.000Z',
          end_date: '2025-09-10T12:00:00.000Z',
          start_time_stamp: 1757383200000,
          end_time_stamp: 1757390400000,
          helper: {
            _id: 'helper_008',
            profile_name: 'helper_eight',
            profile_url: 'https://example.com/profile/helper_eight',
          },
        },
        {
          _id: 'job_009',
          job_status: 'pending',
          order_number: '10020009',
          createdAt: '2025-09-09T13:50:00.000Z',
          job_id: 'job_ref_009',
          start_date: '2025-10-11T07:00:00.000Z',
          end_date: '2025-10-11T09:30:00.000Z',
          start_time_stamp: 1760041200000,
          end_time_stamp: 1760050200000,
          helper: {
            _id: 'helper_009',
            profile_name: 'helper_nine',
            profile_url: 'https://example.com/profile/helper_nine',
          },
        },
        {
          _id: 'job_010',
          job_status: 'in_progress',
          order_number: '10020010',
          createdAt: '2025-10-01T18:00:00.000Z',
          job_id: 'job_ref_010',
          start_date: '2025-11-12T15:00:00.000Z',
          end_date: '2025-11-12T17:30:00.000Z',
          start_time_stamp: 1762710000000,
          end_time_stamp: 1762719000000,
          helper: {
            _id: 'helper_010',
            profile_name: 'helper_ten',
            profile_url: 'https://example.com/profile/helper_ten',
          },
        },
      ];

      const data = getRandomJobs(dummyJobs, 5);

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

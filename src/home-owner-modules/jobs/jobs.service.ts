import { Injectable } from '@nestjs/common';
import { GetHelpersBasedConditionRequestDTO } from './dtos/request/get-helpers-based-on-skill-and-distance.dto';
import { GeoLocationService } from 'src/helper-modules/geo-location/geo-location.service';
import { eAPIResultStatus, JobProgress, JobStatus } from 'src/utils/enum';
import { getHelperBasedonSkillAndDistanceResponseDTO } from './dtos/response/get-helpers-based-on-skill-and-distance.dto';
import { InjectModel } from '@nestjs/mongoose';
import { HelperSkill, HelperSkillDocument } from 'src/entitites/helper-skills';
import { Model } from 'mongoose';
import { CreateSearchJobRequestDTO } from './dtos/request/create-job.dto';
import { SearchJob, SearchJobDocument } from 'src/entitites/search-job';
import {
  formatHelperMainSkills,
  getAvgRatingAndTotalRating,
  haversineDistance,
} from 'src/utils/globalFunctions';
import { MainJobService } from 'src/modules/main-job/main-job.service';
import { SubJobService } from 'src/modules/sub-job/sub-job.service';
import { getUserJobIdsResponseDTO } from './dtos/response/get_user_job_ids.dto';
import {
  ScheduledJob,
  ScheduledJobDocument,
} from 'src/entitites/scheduled-job';
import { HelperJobReviewService } from 'src/helper-modules/helper-job-review/helper-job-review.service';
import { HelperEventService } from 'src/helper-modules/helper-event/helper-event.service';
import { HelperWalletService } from 'src/modules/helper-wallet/helper-wallet.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(SearchJob.name)
    private searchJobModel: Model<SearchJobDocument>,

    @InjectModel(HelperSkill.name)
    private helperSkillModel: Model<HelperSkillDocument>,
    private readonly geoLocationService: GeoLocationService,

    @InjectModel(ScheduledJob.name)
    private scheduledJobModel: Model<ScheduledJobDocument>,

    private readonly mainJobService: MainJobService,

    private readonly subJobService: SubJobService,
    private readonly helperJobReviewService: HelperJobReviewService,
    private readonly helperEventService: HelperEventService,
    private readonly helperWalletService: HelperWalletService,
  ) {}

  async getSugguestedHelpersBasedOnCondition(
    customer_id: string,
    createSearchJobRequestDTO: CreateSearchJobRequestDTO,
  ): Promise<getHelperBasedonSkillAndDistanceResponseDTO> {
    const { distance, main_job_id, sub_job_id } = createSearchJobRequestDTO;

    const { _id, location } = createSearchJobRequestDTO.address;
    try {
      delete createSearchJobRequestDTO.distance;

      const helpersNearByDistanceDTO = {
        longitude: location[0],
        latitude: location[1],
        distance,
      };

      const job = new this.searchJobModel({
        ...createSearchJobRequestDTO,
        customer_id,
        address_id: _id,
      });

      const new_job = await job.save();

      const helpersNearByDistance =
        await this.geoLocationService.findNearbyLocations(
          helpersNearByDistanceDTO,
        );

      if (helpersNearByDistance?.NotFoundHelpersWithInDistance) {
        return helpersNearByDistance;
      }

      const data = [];

      for (const helper of helpersNearByDistance?.data) {
        const scheduledJobs = await this.scheduledJobModel
          .find({
            helper_id: '' + helper.user_id,
          })
          .populate(
            'job_id',
            'start_date end_date extended_end_date extended_start_date',
          );

        // check if helper has any event within the job time period
        const helperEvents =
          await this.helperEventService.checkHelperEventExistsDuringDateRange(
            '' + helper.user_id,
            createSearchJobRequestDTO?.start_date,
            createSearchJobRequestDTO?.end_date,
            createSearchJobRequestDTO?.start_time_stamp,
            createSearchJobRequestDTO?.end_time_stamp,
          );

        if (helperEvents) {
          continue;
        }

        // check if helper has sufficient Point

        const tempResponse =
          await this.helperWalletService.checkAvailablePoints(
            '' + helper?.user_id,
            createSearchJobRequestDTO?.price,
          );

        if (!tempResponse?.balanceAvailable) {
          continue;
        }

        if (scheduledJobs?.length > 0) {
          // Check if any scheduled job overlaps with the new job time period
          const isOverlapping = scheduledJobs.some((scheduledJob: any) => {
            const job: any = scheduledJob.job_id;
            const jobStatus =
              scheduledJob.job_status == JobProgress.Pending ||
              scheduledJob?.job_status == JobProgress.In_Progress;
            if (!job) return false;

            const startDate = new Date(createSearchJobRequestDTO?.start_date);
            const endDate = new Date(createSearchJobRequestDTO?.end_date);
            const scheduledStart = new Date(
              scheduledJob.job_id?.extended_start_date ||
                scheduledJob.job_id?.start_date,
            );
            const scheduledEnd = new Date(
              scheduledJob.job_id?.extended_end_date ||
                scheduledJob.job_id?.end_date,
            );

            return (
              startDate <= scheduledEnd &&
              endDate >= scheduledStart &&
              jobStatus
            );
          });

          if (isOverlapping) {
            continue;
          }
        }

        const helperHasSkill = await this.helperSkillModel
          .findOne({
            helper_id: '' + helper.user_id,
            main_job_id,
            sub_job_id,
            job_status: JobStatus.Approved,
            $or: [{ is_enabled: true }, { is_enabled: { $exists: false } }],
          })
          .populate({ path: 'helper_id' });

        if (helperHasSkill) {
          const skills = await this.fetchHelperDetails('' + helper?.user_id);
          const distance = haversineDistance(
            location[1],
            location[0],
            helper?.location[1],
            helper?.location[0],
          );

          const ratedJobs = await this.scheduledJobModel.find({
            helper_id: '' + helper.user_id,
            job_status: JobProgress.Reviewed,
          });

          const { totalNoOfRatedJobs, avgRating } =
            getAvgRatingAndTotalRating(ratedJobs);

          const customerListWithRating =
            await this.helperJobReviewService.helperCustomerListWithRatingById(
              '' + helper.user_id,
            );
          data.push({
            helper: helperHasSkill?.helper_id,
            location: helper.location,
            skills,
            distance,
            totalNoOfRatedJobs,
            rating: avgRating || 0,
            customerListWithRating,
          });
        }
      }

      if (!data || data?.length === 0) {
        return {
          status: eAPIResultStatus.Success,
          NotFoundHelpersBasedOnSkill: true,
        };
      }

      return {
        status: eAPIResultStatus.Success,
        data,
        job_id: new_job._id.toString(),
      };
    } catch (error) {
      console.log(error.message);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async fetchHelperDetails(helper_id: string) {
    const uniqueMainJobs = new Set();

    const helperSkills = await this.helperSkillModel.find({
      helper_id,
      job_status: JobStatus.Approved,
    });

    const skills = [];
    for (const helperSkill of helperSkills) {
      if (!uniqueMainJobs.has(helperSkill.main_job_id)) {
        const skill = { main_job: {}, sub_jobs: [] };

        const main_job_res = await this.mainJobService.getMainJobById(
          helperSkill.main_job_id,
        );

        const sub_job_res = [];
        const filterDataSubJobs = [...helperSkills]?.filter(
          (skill) =>
            skill.main_job_id.toString() ===
              helperSkill.main_job_id.toString() &&
            skill.helper_id.toString() === helper_id.toString(),
        );
        for (const subjob of filterDataSubJobs) {
          const resData = await this.subJobService.findById(subjob?.sub_job_id);
          if (resData.status === eAPIResultStatus.Success) {
            sub_job_res.push(resData?.data);
          }
        }

        skill.main_job =
          main_job_res?.status === eAPIResultStatus.Success
            ? main_job_res?.data
            : {};
        skill.sub_jobs = sub_job_res;

        skills.push(skill);
        uniqueMainJobs.add(helperSkill.main_job_id);
      }
    }

    return skills;
  }

  async getUserJobIds(customer_id: string): Promise<getUserJobIdsResponseDTO> {
    try {
      const jobs = await this.searchJobModel.find({ customer_id });
      if (!jobs || jobs?.length === 0) {
        return { status: eAPIResultStatus.Success, data: [] };
      }
      const jobIds = jobs.map((job) => job._id.toString());

      return { status: eAPIResultStatus.Success, data: jobIds };
    } catch (error) {
      console.log(error.message);
      return { status: eAPIResultStatus.Failure };
    }
  }
}

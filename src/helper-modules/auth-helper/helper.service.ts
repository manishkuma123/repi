import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  eAPIResultStatus,
  JobProgress,
  JobStatus,
  Role,
  Steps,
} from 'src/utils/enum';
import { User, UserDocument } from 'src/entitites/user';
import { GetHelperByNameResponseDTO } from './dto/response/get-helpers-by-name.dto';
import { UpdateHelperResponseDTO } from './dto/response/update-helper.dto';
import { HelperSkill, HelperSkillDocument } from 'src/entitites/helper-skills';
import {
  GeoLocationDetails,
  GeoLocationDetailsDocument,
} from 'src/entitites/geo-location';
import {
  getAvgRatingAndTotalRating,
  haversineDistance,
} from 'src/utils/globalFunctions';
import { MainJobService } from 'src/modules/main-job/main-job.service';
import { SubJobService } from 'src/modules/sub-job/sub-job.service';
import { Complaint, ComplaintDocument } from 'src/entitites/complaints';
import { ExtendedJob, ExtendedJobDocument } from 'src/entitites/extended-job';
import {
  ForeignPassportHelper,
  ForeignPassportHelperDocument,
} from 'src/entitites/foreign-passport-helper.entity';
import {
  HelperBankDetails,
  HelperBankDetailsDocument,
} from 'src/entitites/helper-bank-details.entity';
import {
  HelperCriminalHistoryCheck,
  HelperCriminalHistoryCheckDocument,
} from 'src/entitites/helper-criminal-history-check';
import { HelperEvent, HelperEventDocument } from 'src/entitites/helper-event';
import {
  HelperJobReview,
  HelperJobReviewDocument,
} from 'src/entitites/helper-job-review';
import {
  HelperTrainingExam,
  HelperTrainingExamDocument,
} from 'src/entitites/helper-training-exam';
import {
  HelperTrainingList,
  HelperTrainingListDocument,
} from 'src/entitites/helper-training-list';
import {
  HomeOwnerAddress,
  HomeOwnerAddressDocument,
} from 'src/entitites/home-owner-address';
import {
  IdentityCardHelper,
  IdentityCardHelperDocument,
} from 'src/entitites/identity-card-helper.entity';
import {
  LoginAttempts,
  LoginAttemptsDocument,
} from 'src/entitites/login-attempts';
import { Otp, OtpDocument } from 'src/entitites/otp';
import { PasswordOtp, PasswordOtpDocument } from 'src/entitites/password-otp';
import { PhoneNoOtp, PhoneNoOtpDocument } from 'src/entitites/phone-no-otp';
import {
  ScheduledJob,
  ScheduledJobDocument,
} from 'src/entitites/scheduled-job';
import { SearchJob, SearchJobDocument } from 'src/entitites/search-job';
import { Suggestion, SuggestionDocument } from 'src/entitites/suggestion';
import { Token, TokenDocument } from 'src/entitites/user-token';
import { HelperOffer, HelperOfferDocument } from 'src/entitites/helper-offer';
import { Types } from 'mongoose';
import { Notification, NotificationDocument } from 'src/entitites/notification';
import { UpdateHelperRequestDTO } from './dto/request/update-helper.dto';
import { GeoLocationService } from '../geo-location/geo-location.service';
import { SkilHelperService } from '../expertise-helper/skill-helper.service';
import { CertificatesService } from '../certificates/certificates.service';
import {
  HelperCertificate,
  HelperCertificateDocument,
} from 'src/entitites/helper-certificates';
import {
  PostponedJob,
  PostponedJobDocument,
} from 'src/entitites/postponed-job';
import { IdentityCardHelperService } from '../identity-card-helper/identity-card-helper.service';
import { ForeignPassportHelperService } from '../foreign-passport-helper/foreign-passport-helper.service';
import { InvitedHelper } from 'src/entitites/invited-helpers';
import * as ExcelJS from 'exceljs';
import axios from 'axios';
import { InviteHelpersRequestDTO } from './dto/request/invite-helpers.dto';
import { sendEmail } from 'src/utils/services/email.service';
import {
  CorporateSkill,
  CorporateSkillDocument,
} from 'src/entitites/corporate-skills';
import {
  CorporateBussinessDocument,
  CorporateBussinessDocumentDocument,
} from 'src/entitites/corporate-bussiness-document';
import { CorporateSkillService } from 'src/corporate-modules/corporate-skill/corporate-skill.service';

@Injectable()
export class HelperService implements OnModuleInit {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(HelperSkill.name)
    private helperSkillModel: Model<HelperSkillDocument>,

    @InjectModel(GeoLocationDetails.name)
    private helperGeoLocation: Model<GeoLocationDetailsDocument>,

    @InjectModel(Complaint.name)
    private complaintModel: Model<ComplaintDocument>,

    @InjectModel(ExtendedJob.name)
    private extendedJobModel: Model<ExtendedJobDocument>,

    @InjectModel(ForeignPassportHelper.name)
    private foreignPassportHelperModel: Model<ForeignPassportHelperDocument>,

    @InjectModel(GeoLocationDetails.name)
    private geoLocationDetailsModel: Model<GeoLocationDetailsDocument>,

    @InjectModel(HelperBankDetails.name)
    private helperBankDetailsModel: Model<HelperBankDetailsDocument>,

    @InjectModel(HelperCriminalHistoryCheck.name)
    private helperCriminalHistoryCheckModel: Model<HelperCriminalHistoryCheckDocument>,

    @InjectModel(HelperEvent.name)
    private helperEventModel: Model<HelperEventDocument>,

    @InjectModel(HelperJobReview.name)
    private helperJobReviewModel: Model<HelperJobReviewDocument>,

    @InjectModel(HelperTrainingExam.name)
    private helperTrainingExamModel: Model<HelperTrainingExamDocument>,

    @InjectModel(HelperTrainingList.name)
    private helperTrainingListModel: Model<HelperTrainingListDocument>,

    @InjectModel(HomeOwnerAddress.name)
    private homeOwnerAddressModel: Model<HomeOwnerAddressDocument>,

    @InjectModel(IdentityCardHelper.name)
    private identityCardHelperModel: Model<IdentityCardHelperDocument>,

    @InjectModel(LoginAttempts.name)
    private loginAttemptsModel: Model<LoginAttemptsDocument>,

    @InjectModel(Otp.name)
    private otpModel: Model<OtpDocument>,

    @InjectModel(PasswordOtp.name)
    private passwordOtpModel: Model<PasswordOtpDocument>,

    @InjectModel(PhoneNoOtp.name)
    private phoneNoOtpModel: Model<PhoneNoOtpDocument>,

    @InjectModel(ScheduledJob.name)
    private scheduledJobModel: Model<ScheduledJobDocument>,

    @InjectModel(SearchJob.name)
    private searchJobModel: Model<SearchJobDocument>,

    @InjectModel(Suggestion.name)
    private suggestionModel: Model<SuggestionDocument>,

    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,

    @InjectModel(HelperOffer.name)
    private helperOfferModel: Model<HelperOfferDocument>,

    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,

    @InjectModel(HelperCertificate.name)
    private helperCertificateModel: Model<HelperCertificateDocument>,

    @InjectModel(PostponedJob.name)
    private PostponedJobModel: Model<PostponedJobDocument>,

    @InjectModel(InvitedHelper.name)
    private invitedHelperModel: Model<InvitedHelper>,

    @InjectModel(CorporateSkill.name)
    private corporateSkillModel: Model<CorporateSkillDocument>,

    @InjectModel(CorporateBussinessDocument.name)
    private corporateBussinessDocumentModel: Model<CorporateBussinessDocumentDocument>,

    private readonly mainJobService: MainJobService,
    private readonly subJobService: SubJobService,
    private readonly geolocationService: GeoLocationService,
    private readonly helperSkillService: SkilHelperService,
    private readonly helperCertificateService: CertificatesService,
    private readonly identityCardHelperService: IdentityCardHelperService,
    private readonly foreignPassportHelperService: ForeignPassportHelperService,
    private readonly corporateSkillService: CorporateSkillService,
  ) {}

  async onModuleInit() {
    const indexes = await this.userModel.collection.indexes();

    for (const index of indexes) {
      const name = index.name;
      if (name === 'profile_name_1' || name === 'alias_name_1') {
        console.log(`Dropping index: ${name}`);
        await this.userModel.collection.dropIndex(name);
      }
    }
  }

  async getHelpersByNameOrByMainJob(
    latitude: number,
    longitude: number,
    keyword?: string,
  ): Promise<GetHelperByNameResponseDTO> {
    try {
      const result = [];
      const uniqueHelpersAndTheirScore = {};

      const fetchHelperDetails = async (helper_id: any, score?: number) => {
        const uniqueMainJobs = new Set();

        const helper = await this.userModel
          .findOne({ _id: helper_id, role: Role.Helper })
          .exec();

        if (helper.role === Role.Customer) {
          return;
        }

        const locationData = await this.helperGeoLocation.findOne({
          user_id: '' + helper?._id,
          role: Role.Helper,
        });

        const helperSkills = await this.helperSkillModel.find({
          helper_id: '' + helper?._id,
          job_status: JobStatus.Approved,
          is_enabled: true,
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
                skill.helper_id.toString() === helper?._id.toString(),
            );
            for (const subjob of filterDataSubJobs) {
              const resData = await this.subJobService.findById(
                subjob?.sub_job_id,
              );
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

        const ratedJobs = await this.scheduledJobModel.find({
          helper_id: '' + helper?._id,
          job_status: JobProgress.Reviewed,
        });

        const customerListWithRating = await this.helperJobReviewModel
          .find({
            helper_id: '' + helper?._id,
          })
          .populate([
            { path: 'customer_id' },
            { path: 'scheduled_job_id', select: 'total_rating' },
          ]);

        const { totalNoOfRatedJobs, avgRating } =
          getAvgRatingAndTotalRating(ratedJobs);

        return {
          helper,
          skills,
          location: {
            longitude: locationData?.location[0],
            latitude: locationData?.location[1],
          },
          distance: haversineDistance(
            latitude,
            longitude,
            locationData?.location[1],
            locationData?.location[0],
          ),
          score,
          totalNoOfRatedJobs,
          rating: avgRating || 0,
          ratedJobs,
          customerListWithRating,
        };
      };

      //helpers by name

      const helpersByName = (await this.userModel
        .find(
          {
            $text: { $search: keyword },
            role: Role.Helper,
          },
          {
            score: { $meta: 'textScore' },
          },
        )

        .lean()
        .exec()) as any[];

      //get  sub_job_ids
      const { subJobIdsAndScore, subJobIds } =
        await this.subJobService.getJobIdsByName(keyword);

      // helpers by sub_job
      const helpersBySubJob = await this.helperSkillModel
        .find({
          sub_job_id: { $in: subJobIds },
          job_status: JobStatus.Approved,
          is_enabled: true,
        })
        .select('helper_id sub_job_id ')
        .exec();

      //get main_job_ids
      const { mainJobIdsScore, mainJobIds } =
        await this.mainJobService.getJobIdsByName(keyword);

      // helpers by main_job
      const helpersByMainJob = await this.helperSkillModel
        .find({
          main_job_id: { $in: mainJobIds },
          job_status: JobStatus.Approved,
        })
        .select('helper_id main_job_id')
        .exec();

      for (const helperSkill of helpersByMainJob) {
        // const helper = helperSkill.helper_id;
        const score = mainJobIdsScore['' + helperSkill?.main_job_id];

        if (helperSkill.helper_id) {
          const helperId = String(helperSkill.helper_id);

          uniqueHelpersAndTheirScore[helperId] =
            uniqueHelpersAndTheirScore[helperId] !== undefined
              ? Math.max(uniqueHelpersAndTheirScore[helperId], score)
              : score;
        }
      }

      for (const helperSkill of helpersBySubJob) {
        const score = subJobIdsAndScore['' + helperSkill?.sub_job_id];

        if (helperSkill.helper_id) {
          const helperId = String(helperSkill.helper_id);

          uniqueHelpersAndTheirScore[helperId] =
            uniqueHelpersAndTheirScore[helperId] !== undefined
              ? Math.max(uniqueHelpersAndTheirScore[helperId], score)
              : score;
        }
      }

      for (const helper of helpersByName) {
        if (helper._id) {
          const helperId = String(helper._id);
          uniqueHelpersAndTheirScore[helperId] =
            uniqueHelpersAndTheirScore[helperId] !== undefined
              ? Math.max(uniqueHelpersAndTheirScore[helperId], helper.score)
              : helper.score;
        }
      }

      const sortedEntries = Object.entries(uniqueHelpersAndTheirScore).sort(
        ([, scoreA], [, scoreB]) => (scoreB as number) - (scoreA as number),
      );

      for (const entry of sortedEntries) {
        const helperDetails = await fetchHelperDetails(
          entry[0],
          entry[1] as number,
        );
        result.push(helperDetails);
      }
      return {
        status: eAPIResultStatus.Success,
        data: result,
      };
    } catch (error) {
      return {
        status: eAPIResultStatus.Failure,
        message: error.message,
      };
    }
  }

  async updateHelper(
    userId: string,
    updateData: UpdateHelperRequestDTO,
  ): Promise<UpdateHelperResponseDTO> {
    try {
      const updatedHelper = await this.userModel.findOne({
        _id: userId,
        role: Role.Helper,
      });

      if (!updatedHelper) {
        return {
          status: eAPIResultStatus.Failure,
          invalidHelper: true,
        };
      }

      if (
        updateData?.profile_name &&
        updateData?.profile_name != updatedHelper?.profile_name
      ) {
        const existingHelper = await this.userModel.findOne({
          profile_name: updateData?.profile_name,
          role: Role.Helper,
        });
        if (existingHelper) {
          return {
            status: eAPIResultStatus.Failure,
            profileNameExistsError: true,
          };
        }
      }

      await this.userModel.updateOne(
        { _id: userId },
        { $set: { ...updateData } },
      );

      if (updateData?.location_details) {
        await this.geolocationService.update(
          updateData?.location_details?._id,
          updateData?.location_details,
        );
      }
      return {
        status: eAPIResultStatus.Success,
      };
    } catch (error) {
      console.log('ERROR ::', error);
      return {
        status: eAPIResultStatus.Failure,
        invalidHelper: true,
      };
    }
  }

  async getHelper(_id: string, role?: string) {
    try {
      const user = await this.userModel
        .findOne({ _id, role: role ?? Role.Helper })
        .populate('corporate_id')
        .lean();

      let ratedJobs = [];

      if (role == Role.Corporator) {
        const helpers = await this.userModel.find({
          corporate_id: '' + _id,
          role: Role.Helper,
        });

        ratedJobs = await this.scheduledJobModel.find({
          helper_id: { $in: helpers.map((helper) => '' + helper._id) },
          job_status: JobProgress.Reviewed,
        });
      } else {
        ratedJobs = await this.scheduledJobModel.find({
          helper_id: _id,
          job_status: JobProgress.Reviewed,
        });
      }

      const { totalNoOfRatedJobs, avgRating } =
        getAvgRatingAndTotalRating(ratedJobs);

      const location = await this.geolocationService.getHelperLocation(_id);
      let skills = [];
      if (role == Role.Corporator) {
        skills =
          await this.corporateSkillService.getAllSkillNameByCorporatorId(_id);
      } else {
        skills = await this.helperSkillService.getAllSkillNameByHelperId(_id);
      }

      const certificates =
        await this.helperCertificateService.getAllAcceptedCertificatesByHelperId(
          _id,
        );

      const identityCard = await this.identityCardHelperService.findOne(
        '' + _id,
      );
      let foreginPassport = null;
      if (!identityCard) {
        foreginPassport = await this.foreignPassportHelperService.findOne(
          '' + _id,
        );
      }

      return {
        status: eAPIResultStatus.Success,
        user: {
          ...user,
          totalNoOfRatedJobs,
          rating: avgRating || 0,
          location,
          skills,
          certificates,
          identityCard,
          foreginPassport,
        },
      };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async deleteHelper(_id: string) {
    try {
      //getHelper
      const helper = await this.userModel.findById(_id);

      //delete helper
      await this.userModel.deleteOne({ _id });

      //delete helper skills
      await this.helperSkillModel.deleteMany({ helper_id: _id });

      //delete helper addresses
      await this.geoLocationDetailsModel.deleteMany({
        user_id: new Types.ObjectId(_id),
      });

      //delete helper complaint
      await this.complaintModel.deleteMany({ user_id: _id });

      //get All helper's jobs
      const jobs = await this.scheduledJobModel.find({ helper_id: _id });

      //delete all extended jobs data and helper review data
      for (const job of jobs) {
        await this.extendedJobModel.deleteOne({ job_id: '' + job?.job_id });
        await this.helperJobReviewModel.deleteOne({
          scheduled_job_id: '' + job?._id,
        });
      }

      //delete foregin passport
      await this.foreignPassportHelperModel.deleteOne({ helper_id: _id });

      //delete bank details
      await this.helperBankDetailsModel.deleteOne({ helper_id: _id });

      //delete crimainal history
      await this.helperCriminalHistoryCheckModel.deleteOne({ helper_id: _id });

      //delete helper event
      await this.helperEventModel.deleteMany({ helper_id: _id });

      // delete herlper identity card
      await this.identityCardHelperModel.deleteOne({ helper_id: _id });

      ///delete login attempts data
      await this.loginAttemptsModel.deleteMany({ user_id: _id });

      //delete helper otp
      await this.otpModel.deleteMany({
        email: helper?.email,
        role: Role.Helper,
      });

      //delete password otp
      await this.passwordOtpModel.deleteMany({
        email: helper?.email,
        role: Role.Helper,
      });

      //delete phone No Otp
      await this.phoneNoOtpModel.deleteMany({
        country_code: helper?.country_code,
        phone_no: helper?.phone_no,
        role: Role.Helper,
      });

      //delete scheduled Jobs
      await this.scheduledJobModel.deleteMany({ helper_id: _id });

      //delete all suggestions
      await this.suggestionModel.deleteMany({ user_id: _id });

      //delete all token
      await this.tokenModel.deleteMany({ user_id: _id });

      //delete helper offer
      await this.helperOfferModel.deleteMany({ helper_id: _id });

      //delete notifications
      await this.notificationModel.deleteMany({
        $or: [{ sender_id: _id }, { receiver_id: _id }],
      });

      //update invited helper if he/she is invited by corporator
      if (helper?.corporate_id) {
        await this.invitedHelperModel.updateOne(
          {
            helper_id: new Types.ObjectId('' + helper?._id),
          },
          {
            $set: { status: false },
            $unset: { helper_id: '' },
          },
        );
      }

      //if corporator then delete its invited helper/its corporate helpers
      if (helper?.role == Role.Corporator) {
        await this.invitedHelperModel.deleteMany({ corporator_id: '' + _id });
        await this.userModel.deleteMany({ corporate_id: '' + _id });
      }

      return { status: eAPIResultStatus.Success };
    } catch (error) {
      console.log('error :: ', error);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async deleteAllUsersData() {
    try {
      const models = [
        this.userModel,
        this.helperSkillModel,
        this.geoLocationDetailsModel,
        this.complaintModel,
        this.extendedJobModel,
        this.foreignPassportHelperModel,
        this.helperBankDetailsModel,
        this.helperCertificateModel,
        this.helperCriminalHistoryCheckModel,
        this.helperEventModel,
        this.helperJobReviewModel,
        this.homeOwnerAddressModel,
        this.identityCardHelperModel,
        this.loginAttemptsModel,
        this.notificationModel,
        this.otpModel,
        this.passwordOtpModel,
        this.phoneNoOtpModel,
        this.PostponedJobModel,
        this.scheduledJobModel,
        this.searchJobModel,
        this.suggestionModel,
        this.tokenModel,
        this.helperOfferModel,
        this.invitedHelperModel,
        this.corporateSkillModel,
        this.corporateBussinessDocumentModel,
      ];

      for (const mod of models as any[]) {
        await mod.deleteMany({});
      }
      return { status: eAPIResultStatus.Success };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async completeFirstStep(
    userId: string,
    updateData: UpdateHelperRequestDTO,
  ): Promise<UpdateHelperResponseDTO> {
    try {
      const updatedHelper = await this.userModel.findOne({
        _id: userId,
        role: { $in: [Role.Corporator, Role.Helper] },
      });

      if (!updatedHelper) {
        return {
          status: eAPIResultStatus.Failure,
          invalidHelper: true,
        };
      }

      const updateObject: any = {
        $set: {
          profile_url: updateData?.profile_url,
          step: Steps?.Second,
        },
        $inc: { points: 200 },
      };

      await this.userModel.updateOne({ _id: userId }, updateObject);

      const corporateHelper = await this.invitedHelperModel.findOne({
        country_code: updatedHelper?.country_code,
        phone_no: updatedHelper?.phone_no,
      });

      // add points to his/her corporator also
      if (corporateHelper) {
        await this.userModel.updateOne(
          { _id: new Types.ObjectId(corporateHelper?.corporator_id) },
          { $inc: { points: 200 } },
        );
      }

      return {
        status: eAPIResultStatus.Success,
      };
    } catch (error) {
      console.log('ERROR ::', error);
      return {
        status: eAPIResultStatus.Failure,
        invalidHelper: true,
      };
    }
  }

  async completeSecondStep(userId: string): Promise<any> {
    try {
      const updatedHelper = await this.userModel.findOne({
        _id: userId,
        role: { $in: [Role.Corporator, Role.Helper] },
      });

      if (!updatedHelper) {
        return {
          status: eAPIResultStatus.Failure,
          invalidHelper: true,
        };
      }

      const corporate = await this.userModel.findOne({
        _id: userId,
        role: Role.Corporator,
      });

      const updateObject: any = {
        $set: {
          isIdentityVerified: true,
          step: corporate ? Steps.Completed : Steps?.Third,
        },
        $inc: { points: 200 },
      };

      await this.userModel.updateOne({ _id: userId }, updateObject);

      const corporateHelper = await this.invitedHelperModel.findOne({
        country_code: updatedHelper?.country_code,
        phone_no: updatedHelper?.phone_no,
      });

      if (corporateHelper) {
        await this.userModel.updateOne(
          { _id: new Types.ObjectId(corporateHelper?.corporator_id) },
          { $inc: { points: 200 } },
        );
      }

      return {
        status: eAPIResultStatus.Success,
      };
    } catch (error) {
      console.log('ERROR ::', error);
      return {
        status: eAPIResultStatus.Failure,
        invalidHelper: true,
      };
    }
  }

  async importDataFromExcel(
    inviteHelpersRequestDTO: InviteHelpersRequestDTO,
  ): Promise<{ status: eAPIResultStatus; invalidCorporator?: boolean }> {
    try {
      const { url, country_code, phone_no } = inviteHelpersRequestDTO;
      const corporator = await this.userModel.findOne({
        role: Role.Corporator,
        country_code,
        phone_no,
      });
      if (!corporator) {
        return { status: eAPIResultStatus.Failure, invalidCorporator: true };
      }
      // Step 1: Download Excel file
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(response.data);
      const sheet = workbook.worksheets[0];

      // Step 3: Parse rows (assume first row is header)
      const savePromises = [];
      sheet.eachRow((row: any, rowNumber) => {
        if (rowNumber === 1) return; // Skip header

        // Convert row.values to an array and skip the first undefined element
        const values = Array.from(row?.values).slice(1); // row.values[0] is undefined

        console.log('values', values);
        // Check if we have enough values
        if (values.length < 8) return;

        const [
          full_name,
          profile_name,
          country_code,
          phone_no,
          email,
          password,
          lat,
          long,
        ] = values;
        if (
          !full_name ||
          !profile_name ||
          !country_code ||
          !phone_no ||
          !email ||
          !password
        )
          return;

        const helper = new this.invitedHelperModel({
          full_name,
          profile_name,
          country_code,
          phone_no,
          email,
          password,
          lat,
          lng: long,
          corporator_id: corporator._id,
        });

        // send email to helper

        sendEmail({
          to: email,
          subject: 'Invite you to Mindhome',
          message: `Hi ${full_name},\n\nYou have been invited to join Mindhome. \nBest regards,\nMindhome Team`,
        });
        savePromises.push(helper.save());
      });

      await Promise.all(savePromises);

      return { status: eAPIResultStatus.Success };
    } catch (error) {
      console.error('Error importing from Excel:', error);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async deleteAllInvitedHelpers() {
    try {
      await this.invitedHelperModel.deleteMany();
      return { status: eAPIResultStatus.Success };
    } catch (error) {
      console.error('Error deleting invited helpers:', error);
      return { status: eAPIResultStatus.Failure };
    }
  }

  //get invited-helpers
  async getInvitedHelpers() {
    try {
      const invitedHelpers = await this.invitedHelperModel
        .find()

        .lean();

      return {
        status: eAPIResultStatus.Success,
        data: invitedHelpers,
      };
    } catch (error) {
      console.error('Error fetching invited helpers:', error);
      return { status: eAPIResultStatus.Failure };
    }
  }
}

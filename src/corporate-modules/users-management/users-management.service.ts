import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  InvitedHelper,
  InvitedHelperDocument,
} from 'src/entitites/invited-helpers';
import { User, UserDocument } from 'src/entitites/user';
import { eAPIResultStatus, JobStatus, Role } from 'src/utils/enum';
import { CreateHelperDTO } from './dtos/request/create-helper.dto';
import { UpdateHelperDTO } from './dtos/request/update-helper.dto';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { GeoLocationService } from 'src/helper-modules/geo-location/geo-location.service';
import {
  GeoLocationDetails,
  GeoLocationDetailsDocument,
} from 'src/entitites/geo-location';
import { GetHelpersDTO } from './dtos/request/get-helpers.dto';
import { HelperSkill, HelperSkillDocument } from 'src/entitites/helper-skills';
import { SubJob, SubJobDocument } from 'src/entitites/sub-job';
import { SkilHelperService } from 'src/helper-modules/expertise-helper/skill-helper.service';
import { ScheduledJobService } from 'src/modules/scheduled-job/scheduled-job.service';

@Injectable()
export class UsersManagementService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(InvitedHelper.name)
    private invitedHelperModel: Model<InvitedHelperDocument>,
    @InjectModel(HelperSkill.name)
    private helperSkillModel: Model<HelperSkillDocument>,
    @InjectModel(SubJob.name)
    private subJobModel: Model<SubJobDocument>,
    private readonly geoLocationService: GeoLocationService,
    private readonly helperSkillService: SkilHelperService,
    private readonly scheduledJobService: ScheduledJobService,
  ) {}

  async createHelper(
    corporateId: string,
    createHelperDto: CreateHelperDTO,
  ): Promise<ResponseDTO> {
    try {
      const corporator = await this.userModel.findOne({
        _id: new Types.ObjectId(corporateId),
        role: Role.Corporator,
      });

      if (!corporator) {
        return {
          status: eAPIResultStatus.Failure,
          message: 'Corporator not found',
        };
      }

      const existingByProfileName = await this.checkProfileNameExists(
        createHelperDto.profile_name,
      );

      if (existingByProfileName) {
        return {
          status: eAPIResultStatus.Failure,
          message: 'Profile name already exists',
        };
      }

      const existingByPhoneNo = await this.checkPhoneNumberExists(
        createHelperDto.country_code,
        createHelperDto.phone_no,
      );

      if (existingByPhoneNo) {
        return {
          status: eAPIResultStatus.Failure,
          message: 'Phone number already exists',
        };
      }
      const newInvitedHelper = new this.invitedHelperModel({
        ...createHelperDto,
        corporator_id: corporateId,
        status: false,
      });

      const savedHelper = await newInvitedHelper.save();

      return {
        status: eAPIResultStatus.Success,
        data: savedHelper,
        message: 'Helper created successfully',
      };
    } catch (error) {
      console.error('Error creating helper:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Something went wrong',
      };
    }
  }

  async updateHelper(
    helperId: string,
    updateHelperDto: UpdateHelperDTO,
  ): Promise<ResponseDTO> {
    try {
      const existingUser = await this.userModel.findById(helperId);

      const { lat, lng, address, ...helperDataWithoutCoordinates } =
        updateHelperDto;

      if (existingUser) {
        if (
          helperDataWithoutCoordinates.profile_name &&
          helperDataWithoutCoordinates.profile_name !==
            existingUser.profile_name
        ) {
          const profileNameExists = await this.checkProfileNameExists(
            helperDataWithoutCoordinates.profile_name,
            helperId,
          );

          if (profileNameExists) {
            return {
              status: eAPIResultStatus.Failure,
              message: 'Profile name already exists',
            };
          }
        }

        if (
          helperDataWithoutCoordinates.phone_no &&
          helperDataWithoutCoordinates.phone_no !== existingUser.phone_no
        ) {
          const phoneNumberExists = await this.checkPhoneNumberExists(
            helperDataWithoutCoordinates.country_code,
            helperDataWithoutCoordinates.phone_no,
            helperId,
          );

          if (phoneNumberExists) {
            return {
              status: eAPIResultStatus.Failure,
              message: 'Phone number already exists',
            };
          }
        }

        const updatedUser = await this.userModel.findByIdAndUpdate(
          helperId,
          {
            $set: helperDataWithoutCoordinates,
            full_name:
              helperDataWithoutCoordinates.full_name +
              ' ' +
              helperDataWithoutCoordinates?.family_name,
          },
          { new: true },
        );

        if (lat !== undefined && lng !== undefined && address !== undefined) {
          const geoLocationDTO = {
            location: [lng, lat] as [number, number],
            location_name: address,
          };
          await this.geoLocationService.create(updatedUser, geoLocationDTO);
        }

        return {
          status: eAPIResultStatus.Success,
          data: updatedUser,
          message: 'Helper updated successfully',
        };
      } else {
        const existingInvitedHelper =
          await this.invitedHelperModel.findById(helperId);

        if (!existingInvitedHelper) {
          return {
            status: eAPIResultStatus.Failure,
            message: 'Helper not found',
          };
        }

        if (
          updateHelperDto.profile_name &&
          updateHelperDto.profile_name !== existingInvitedHelper.profile_name
        ) {
          const profileNameExists = await this.checkProfileNameExists(
            updateHelperDto.profile_name,
            helperId,
          );

          if (profileNameExists) {
            return {
              status: eAPIResultStatus.Failure,
              message: 'Profile name already exists',
            };
          }
        }

        if (
          updateHelperDto.country_code &&
          updateHelperDto.country_code !== existingInvitedHelper.country_code &&
          updateHelperDto.phone_no &&
          updateHelperDto.phone_no !== existingInvitedHelper.phone_no
        ) {
          const phoneNumberExists = await this.checkPhoneNumberExists(
            updateHelperDto.country_code,
            updateHelperDto.phone_no,
            helperId,
          );

          if (phoneNumberExists) {
            return {
              status: eAPIResultStatus.Failure,
              message: 'Phone number already exists',
            };
          }
        }
        const updatedHelper = await this.invitedHelperModel.findByIdAndUpdate(
          helperId,
          {
            $set: {
              ...updateHelperDto,
            },
          },
          { new: true },
        );

        return {
          status: eAPIResultStatus.Success,
          data: updatedHelper,
          message: 'Helper updated successfully',
        };
      }
    } catch (error) {
      console.error('Error updating helper:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Something went wrong',
      };
    }
  }

  async getHelpers(
    corporateId: string,
    getHelpersDto: GetHelpersDTO,
  ): Promise<ResponseDTO> {
    try {
      const { page = 1, limit = 10 } = getHelpersDto;
      const skip = (page - 1) * limit;

      const invitedHelpers = await this.invitedHelperModel
        .find({
          corporator_id: corporateId,
        })
        .populate('helper_id')
        .sort({ status: 'desc' })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();

      const registeredHelperIds = invitedHelpers
        .filter((helper) => helper.status)
        .filter((helper) => helper.helper_id)
        .map((helper) => helper.helper_id._id.toString());

      const geoLocations =
        await this.geoLocationService.getGeoLocations(registeredHelperIds);

      const geoLocationMap = new Map(
        geoLocations.map((geo) => [geo.user_id.toString(), geo]),
      );

      const formattedHelpers = await Promise.all(
        invitedHelpers?.map(async (invitedHelper: any) => {
          const isRegistered = invitedHelper.status;
          const user: any = isRegistered
            ? invitedHelper.helper_id
            : invitedHelper;

          const userId = isRegistered
            ? user._id.toString()
            : invitedHelper._id.toString();

          const geoLocation = isRegistered ? geoLocationMap.get(userId) : null;

          let firstName = invitedHelper?.full_name;
          let lastName = invitedHelper?.family_name;
          if (isRegistered && user?.full_name) {
            const nameParts = user?.full_name?.split(' ');
            firstName = nameParts?.[0] || invitedHelper.full_name;
            lastName =
              (nameParts?.length > 1 ? nameParts?.slice(1).join(' ') : '') ||
              invitedHelper?.family_name;
          }

          let skills =
            isRegistered &&
            (await this.helperSkillService.getApprovedAndEnabledSkillsByHelperId(
              userId,
            ));

          const incomeAndLastDate =
            isRegistered &&
            (await this.scheduledJobService.getHelperIncomeAndLastJobDate(
              '' + userId,
            ));

          return {
            _id: userId,
            name: isRegistered ? firstName : invitedHelper.full_name || '',
            family_name: isRegistered
              ? lastName
              : invitedHelper.family_name || '',
            phone_no: isRegistered
              ? user.phone_no
              : invitedHelper.phone_no || '',
            country_code: isRegistered
              ? user.country_code
              : invitedHelper.country_code || '',
            lat: isRegistered
              ? geoLocation?.location?.[1] || null
              : invitedHelper.lat || null,
            lng: isRegistered
              ? geoLocation?.location?.[0] || null
              : invitedHelper.lng || null,
            address: isRegistered
              ? geoLocation?.location_name || ''
              : invitedHelper.address || '',
            status: isRegistered ? true : false,
            profile_url: isRegistered
              ? user.profile_url
              : invitedHelper.profile_url || '',
            profile_name: isRegistered
              ? user.profile_name
              : invitedHelper.profile_name || '',
            skills,
            total_income: isRegistered ? incomeAndLastDate?.total_income : 0,
            last_completed_job_date: isRegistered
              ? incomeAndLastDate?.last_completed_job_date
              : null,
            registered_date: isRegistered
              ? user.registered_date
              : invitedHelper.createdAt,
          };
        }),
      );

      // Apply pagination
      const totalCount = await this.invitedHelperModel.countDocuments({
        corporator_id: corporateId,
      });

      return {
        status: eAPIResultStatus.Success,
        data: {
          helpers: formattedHelpers,
          pagination: {
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
          },
        },
        message: 'Helpers fetched successfully',
      };
    } catch (error) {
      console.error('Error fetching helpers:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Something went wrong',
      };
    }
  }

  private async checkProfileNameExists(
    profileName: string,
    excludeId?: string,
  ): Promise<boolean> {
    const userQuery: any = { profile_name: profileName };
    if (excludeId) {
      userQuery._id = { $ne: excludeId };
    }

    const existingUserByProfileName = await this.userModel.findOne(userQuery);

    if (existingUserByProfileName) {
      return true;
    }

    const invitedHelperQuery: any = { profile_name: profileName };
    if (excludeId) {
      invitedHelperQuery._id = { $ne: excludeId };
    }

    const existingInvitedHelperByProfileName =
      await this.invitedHelperModel.findOne(invitedHelperQuery);

    return !!existingInvitedHelperByProfileName;
  }

  private async checkPhoneNumberExists(
    countryCode: string,
    phoneNo: string,
    excludeId?: string,
  ): Promise<boolean> {
    const userQuery: any = {
      country_code: countryCode,
      phone_no: phoneNo,
      role: { $in: [Role.Corporator, Role.Helper] },
    };
    if (excludeId) {
      userQuery._id = { $ne: excludeId };
    }

    const existingUserByPhoneNo = await this.userModel.findOne(userQuery);

    if (existingUserByPhoneNo) {
      return true;
    }

    const invitedHelperQuery: any = {
      country_code: countryCode,
      phone_no: phoneNo,
    };

    if (excludeId) {
      invitedHelperQuery._id = { $ne: excludeId };
    }

    const existingInvitedHelperByPhoneNo =
      await this.invitedHelperModel.findOne(invitedHelperQuery);

    return !!existingInvitedHelperByPhoneNo;
  }
}

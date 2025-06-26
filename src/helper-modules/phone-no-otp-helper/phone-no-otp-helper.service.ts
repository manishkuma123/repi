import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomValidationException } from 'src/customExceptions/validation-exception';
import { SendPhoneNoOTPRequestDTO } from 'src/dtos/phone-no-otp/request/send-otp';
import { VerifyPhoneNoOTPRequestDTO } from 'src/dtos/phone-no-otp/request/verify-otp';
import { SendPhoneNoOTPResponseDTO } from 'src/dtos/phone-no-otp/response/send-otp';
import { VerifyPhoneNoOTPResponseDTO } from 'src/dtos/phone-no-otp/response/verify-otp';
import { PhoneNoOtp, PhoneNoOtpDocument } from 'src/entitites/phone-no-otp';
import { User, UserDocument } from 'src/entitites/user';
import { TwilioService } from 'src/modules/twilio/twilio.service';
import { eAPIResultStatus, Role } from 'src/utils/enum';
import { generateOtp, validateOtp } from 'src/utils/globalFunctions';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Token, TokenDocument } from 'src/entitites/user-token';
import {
  InvitedHelper,
  InvitedHelperDocument,
} from 'src/entitites/invited-helpers';
import {
  GeoLocationDetails,
  GeoLocationDetailsDocument,
} from 'src/entitites/geo-location';
import { ConfigurationService } from 'src/modules/configuration/configuration.service';

@Injectable()
export class PhoneNoOtpHelperService {
  constructor(
    @InjectModel(PhoneNoOtp.name)
    private phoneNoOtpModel: Model<PhoneNoOtpDocument>,

    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,

    @InjectModel(InvitedHelper.name)
    private invitedHelperModel: Model<InvitedHelperDocument>,
    @InjectModel(GeoLocationDetails.name)
    private geolocationModel: Model<GeoLocationDetailsDocument>,

    private readonly twilioService: TwilioService,
    private jwtService: JwtService,
    private readonly configurationService: ConfigurationService,
  ) {}

  async createOtp(
    createOtpDto: SendPhoneNoOTPRequestDTO,
  ): Promise<SendPhoneNoOTPResponseDTO> {
    try {
      const { phone_no, country_code, role } = createOtpDto;

      const helper = await this.userModel.findOne({
        phone_no,
        country_code,
        role: { $in: [Role.Corporator, Role.Helper] },
      });
      if (helper) {
        return {
          status: eAPIResultStatus.Failure,
          isPhoneNoExistError: true,
        };
      }

      const otp = await generateOtp(6);
      const expiry_time = new Date();
      expiry_time.setMinutes(expiry_time.getMinutes() + 2);
      const newOtp = new this.phoneNoOtpModel({
        phone_no,
        country_code,
        otp,
        expiry_time,
        role: role ?? Role.Helper,
      });
      await newOtp.save();

      //send otp through twilio
      const response = await this.twilioService.sendOTP(
        otp,
        country_code,
        phone_no,
      );
      if (
        response?.status === eAPIResultStatus.Failure &&
        response?.invalidPhoneNumber
      ) {
        return { status: eAPIResultStatus.Failure, invalidPhoneError: true };
      }

      return {
        status: eAPIResultStatus.Success,
        data: otp,
      };
    } catch (error) {
      console.log('ERROR ::: ', error);
      throw new CustomValidationException(error.message);
    }
  }

  async createOtpForLogin(
    createOtpDto: SendPhoneNoOTPRequestDTO,
  ): Promise<SendPhoneNoOTPResponseDTO> {
    try {
      const { phone_no, country_code, role } = createOtpDto;

      const otp = await generateOtp(6);
      const expiry_time = new Date();
      expiry_time.setMinutes(expiry_time.getMinutes() + 2);
      const newOtp = new this.phoneNoOtpModel({
        phone_no,
        country_code,
        otp,
        expiry_time,
        role: role ?? Role.Helper,
      });
      await newOtp.save();

      //send otp through twilio
      const response = await this.twilioService.sendOTP(
        otp,
        country_code,
        phone_no,
      );
      if (
        response?.status === eAPIResultStatus.Failure &&
        response?.invalidPhoneNumber
      ) {
        return { status: eAPIResultStatus.Failure, invalidPhoneError: true };
      }

      return {
        status: eAPIResultStatus.Success,
        data: otp,
      };
    } catch (error) {
      console.log('ERROR ::: ', error);
      throw new CustomValidationException(error.message);
    }
  }

  async validateOtp(
    verifyOTPRequestDTO: VerifyPhoneNoOTPRequestDTO,
  ): Promise<VerifyPhoneNoOTPResponseDTO> {
    try {
      const { phone_no, country_code, otp, role } = verifyOTPRequestDTO;

      if (!otp) {
        return {
          status: eAPIResultStatus.Failure,
          otpRequired: true,
        };
      }

      const existingHelper = await this.userModel.findOne({
        phone_no,
        country_code,
        role: { $in: [Role.Corporator, Role.Helper] },
      });
      if (existingHelper) {
        return {
          status: eAPIResultStatus.Failure,
          isPhoneExistsError: true,
        };
      }

      const OtpRecord: any = await this.phoneNoOtpModel
        .findOne({ phone_no, country_code, role: role ?? Role.Helper })
        .sort({ create_date: -1 })
        .exec();

      if (!OtpRecord) {
        return {
          status: eAPIResultStatus.Failure,
          invalidOTPError: true,
        };
      }

      const isValid = validateOtp(
        OtpRecord.otp,
        OtpRecord.create_date,
        OtpRecord.expiry_time,
        otp,
      );

      if (isValid) {
        return {
          status: eAPIResultStatus.Failure,
          invalidOTPError: true,
        };
      }

      if (verifyOTPRequestDTO?.profile_name) {
        const existingProfileName = await this.userModel.findOne({
          profile_name: verifyOTPRequestDTO.profile_name,
        });
        if (existingProfileName) {
          return {
            status: eAPIResultStatus.Failure,
            profileNameExistsError: true,
          };
        }
      }

      verifyOTPRequestDTO.role = role ?? Role.Helper;
      verifyOTPRequestDTO.isVerified = true;

      const configuration: any =
        await this.configurationService.getConfiguration();
      const configData: any = configuration.data;
      const defaultWarrantyPeriod = configData?.DEFAULT_WARRANTY_PERIOD
        ? parseInt(configData?.DEFAULT_WARRANTY_PERIOD)
        : 0;

      const newHelper = new this.userModel({
        ...verifyOTPRequestDTO,
        defaultWarrantyPeriod: defaultWarrantyPeriod,
        country_code:
          verifyOTPRequestDTO?.country_code &&
          !verifyOTPRequestDTO?.country_code.startsWith('+')
            ? '+' + verifyOTPRequestDTO?.country_code
            : verifyOTPRequestDTO?.country_code,
      });

      const corporateHelper = await this.invitedHelperModel.findOne({
        $or: [
          {
            phone_no: verifyOTPRequestDTO.phone_no,
            country_code: verifyOTPRequestDTO.country_code?.split('+')[1],
          },
          {
            phone_no: verifyOTPRequestDTO.phone_no,
            country_code: verifyOTPRequestDTO.country_code,
          },
        ],
      });

      //yes if helper is invited by corporator

      let corporate = null;
      if (corporateHelper) {
        corporate = await this.userModel.findById(
          corporateHelper.corporator_id,
        );

        newHelper.corporate_id = corporateHelper.corporator_id;
      }

      const helper = await newHelper.save();

      if (corporateHelper) {
        await this.geolocationModel.create({
          user_id: '' + helper._id,
          location: [corporateHelper.lng, corporateHelper.lat],
          location_name: corporateHelper?.address,
          role: Role.Helper,
        });

        await this.invitedHelperModel.updateOne(
          { _id: corporateHelper?._id },
          { $set: { helper_id: helper?._id, status: true } },
        );
      }

      const payload = {
        _id: helper._id,
        role: helper.role,
      };

      const access_token = this.jwtService.sign(payload);

      await this.tokenModel.create({ user_id: helper._id, access_token });

      return {
        status: eAPIResultStatus.Success,
        accessToken: access_token,
        user: helper,
        corporate,
      };
    } catch (error) {
      console.log('ERROR ::: ', error);
      return {
        status: eAPIResultStatus.Failure,
      };
    }
  }

  async verifyPhoneNoOTPForLogin(dto: VerifyPhoneNoOTPRequestDTO) {
    try {
      const { phone_no, country_code, otp, role } = dto;

      if (!otp) {
        return {
          status: eAPIResultStatus.Failure,
          otpRequired: true,
        };
      }

      const OtpRecord: any = await this.phoneNoOtpModel
        .findOne({ phone_no, country_code, role: role ?? Role.Helper })
        .sort({ create_date: -1 })
        .exec();

      if (!OtpRecord) {
        return {
          status: eAPIResultStatus.Failure,
          invalidOTPError: true,
        };
      }

      const isValid = validateOtp(
        OtpRecord.otp,
        OtpRecord.create_date,
        OtpRecord.expiry_time,
        otp,
      );

      if (isValid) {
        return {
          status: eAPIResultStatus.Failure,
          invalidOTPError: true,
        };
      }

      return {
        status: eAPIResultStatus.Success,
      };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }
}

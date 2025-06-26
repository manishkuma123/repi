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

@Injectable()
export class PhoneNoOtpHomeOwnerService {
  constructor(
    @InjectModel(PhoneNoOtp.name)
    private phoneNoOtpModel: Model<PhoneNoOtpDocument>,

    @InjectModel(User.name) private userModel: Model<UserDocument>,

    private readonly twilioService: TwilioService,
  ) {}

  async createOtp(
    createOtpDto: SendPhoneNoOTPRequestDTO,
  ): Promise<SendPhoneNoOTPResponseDTO> {
    try {
      const { phone_no, country_code } = createOtpDto;

      const homeOwner = await this.userModel.findOne({
        phone_no,
        country_code,
        role: Role.Customer,
      });
      if (homeOwner) {
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
        role: Role.Customer,
      });
      await newOtp.save();

      // send otp through twilio

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
      console.log('ERROR :::', error);
      throw new CustomValidationException(error.message);
    }
  }

  async validateOtp(
    verifyOTPRequestDTO: VerifyPhoneNoOTPRequestDTO,
  ): Promise<VerifyPhoneNoOTPResponseDTO> {
    try {
      const { phone_no, country_code, otp } = verifyOTPRequestDTO;

      if (!otp) {
        return {
          status: eAPIResultStatus.Failure,
          otpRequired: true,
        };
      }

      const existingHomeOwner = await this.userModel.findOne({
        phone_no,
        country_code,
        role: Role.Customer,
      });
      if (existingHomeOwner) {
        return {
          status: eAPIResultStatus.Failure,
          isPhoneExistsError: true,
        };
      }

      const OtpRecord: any = await this.phoneNoOtpModel
        .findOne({ phone_no, country_code, role: Role.Customer })
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
      return {
        status: eAPIResultStatus.Failure,
      };
    }
  }

  async createOtpForLogin(
    createOtpDto: SendPhoneNoOTPRequestDTO,
  ): Promise<SendPhoneNoOTPResponseDTO> {
    try {
      const { phone_no, country_code } = createOtpDto;

      const otp = await generateOtp(6);
      const expiry_time = new Date();
      expiry_time.setMinutes(expiry_time.getMinutes() + 2);
      const newOtp = new this.phoneNoOtpModel({
        phone_no,
        country_code,
        otp,
        expiry_time,
        role: Role.Customer,
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

  async verifyPhoneNoOTPForLogin(dto: VerifyPhoneNoOTPRequestDTO) {
    try {
      const { phone_no, country_code, otp } = dto;

      if (!otp) {
        return {
          status: eAPIResultStatus.Failure,
          otpRequired: true,
        };
      }

      const OtpRecord: any = await this.phoneNoOtpModel
        .findOne({ phone_no, country_code, role: Role.Customer })
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

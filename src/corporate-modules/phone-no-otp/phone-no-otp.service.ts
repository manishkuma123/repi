import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { stat } from 'fs';
import { Model } from 'mongoose';
import { SendPhoneNoOTPRequestDTO } from 'src/dtos/phone-no-otp/request/send-otp';
import { VerifyPhoneNoOTPRequestDTO } from 'src/dtos/phone-no-otp/request/verify-otp';
import { PhoneNoOtp, PhoneNoOtpDocument } from 'src/entitites/phone-no-otp';
import { TwilioService } from 'src/modules/twilio/twilio.service';
import { eAPIResultStatus, Role } from 'src/utils/enum';
import { generateOtp, validateOtp } from 'src/utils/globalFunctions';

@Injectable()
export class PhoneNoOtpService {
  constructor(
    @InjectModel(PhoneNoOtp.name)
    private phoneNoOtpModel: Model<PhoneNoOtpDocument>,
    private readonly twilioService: TwilioService,
  ) {}

  async createOtpForLogin(createOtpDto: SendPhoneNoOTPRequestDTO) {
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
        role: Role.Corporator,
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
        return {
          status: eAPIResultStatus.Failure,
          message: 'Invalid Phone Number',
        };
      }

      return {
        status: eAPIResultStatus.Success,
        data: otp,
      };
    } catch (error) {
      return {
        status: eAPIResultStatus.Failure,
        message: 'Something went wrong',
      };
    }
  }

  async verifyPhoneNoOTPForLogin(dto: VerifyPhoneNoOTPRequestDTO) {
    try {
      const { phone_no, country_code, otp } = dto;

      if (!otp) {
        return {
          status: eAPIResultStatus.Failure,
          message: 'OTP is required',
        };
      }

      const OtpRecord: any = await this.phoneNoOtpModel
        .findOne({ phone_no, country_code, role: Role.Corporator })
        .sort({ create_date: -1 })
        .exec();

      if (!OtpRecord) {
        return {
          status: eAPIResultStatus.Failure,
          message: 'OTP not found',
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
          message: 'Invalid OTP',
        };
      }

      return {
        status: eAPIResultStatus.Success,
      };
    } catch (error) {
      return {
        status: eAPIResultStatus.Failure,
        message: 'Something went wrong',
      };
    }
  }
}

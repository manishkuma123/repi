import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  dateFormatter,
  generateOtp,
  validateOtp,
} from 'src/utils/globalFunctions';
import { sendEmail } from 'src/utils/services/email.service';
import { Otp } from 'src/entitites/otp';
import { User } from 'src/entitites/user';
import { SendOtpRequestDTO } from 'src/dtos/otp-dto/request/send-otp-request.dto';
import { SendOTPResponseDTO } from 'src/dtos/otp-dto/response/send-otp-response.dto';
import { eAPIResultStatus, Role } from 'src/utils/enum';
import { CustomValidationException } from 'src/customExceptions/validation-exception';
import { VerifyOTPRequestDTO } from 'src/dtos/otp-dto/request/verify-otp-request.dto';
import { VerifyOTPResponseDTO } from 'src/dtos/otp-dto/response/verify-otp-response.dto';

@Injectable()
export class OtpHelperService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,

    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createOtp(
    createOtpDto: SendOtpRequestDTO,
  ): Promise<SendOTPResponseDTO> {
    try {
      const { email } = createOtpDto;

      const helper = await this.userModel.findOne({ email, role: Role.Helper });
      if (helper) {
        return {
          status: eAPIResultStatus.Failure,
          isEmailExistError: true,
        };
      }

      const otp = await generateOtp(6);
      const expiry_time = new Date();
      expiry_time.setMinutes(expiry_time.getMinutes() + 2);
      const newOtp = new this.otpModel({
        email,
        otp,
        expiry_time,
        role: Role.Helper,
      });
      await newOtp.save();

      sendEmail({
        to: email,
        subject: 'Email Verification From MindHome',
        message: `OTP ของคุณ คือ ${otp}. รหัสจาก Mindhome นี้จะหมดอายุภายใน 2นาที`,
      });
      return {
        status: eAPIResultStatus.Success,
      };
    } catch (error) {
      throw new CustomValidationException(error.message);
    }
  }

  async validateOtp(
    verifyOTPRequestDTO: VerifyOTPRequestDTO,
  ): Promise<VerifyOTPResponseDTO> {
    try {
      const { email, OTP } = verifyOTPRequestDTO;

      if (!OTP) {
        return {
          status: eAPIResultStatus.Failure,
          otpRequired: true,
        };
      }

      const existingHelper = await this.userModel.findOne({
        email,
        role: Role.Helper,
      });
      if (existingHelper) {
        return {
          status: eAPIResultStatus.Failure,
          isEmailExistsError: true,
        };
      }

      const OtpRecord: any = await this.otpModel
        .findOne({ email, role: Role.Helper })
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
        OTP,
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
}

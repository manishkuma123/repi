import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  dateFormatter,
  generateOtp,
  validateOtp,
} from 'src/utils/globalFunctions';
import { sendEmail } from 'src/utils/services/email.service';
import { SendOtpRequestDTO } from 'src/dtos/otp-dto/request/send-otp-request.dto';
import { SendOTPResponseDTO } from 'src/dtos/otp-dto/response/send-otp-response.dto';
import { User, UserDocument } from 'src/entitites/user';
import { PasswordOtp, PasswordOtpDocument } from 'src/entitites/password-otp';
import { eAPIResultStatus, Role } from 'src/utils/enum';
import { VerifyOTPRequestDTO } from 'src/dtos/otp-dto/request/verify-otp-request.dto';
import { VerifyOTPResponseDTO } from 'src/dtos/otp-dto/response/verify-otp-response.dto';

@Injectable()
export class PasswordOtpHelperService {
  constructor(
    @InjectModel(PasswordOtp.name)
    private otpModel: Model<PasswordOtpDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createOtp(
    createOtpDto: SendOtpRequestDTO,
  ): Promise<SendOTPResponseDTO> {
    try {
      const { email } = createOtpDto;

      const helper = await this.userModel.findOne({ email, role: Role.Helper });
      if (!helper) {
        return {
          invalidEmailError: true,
          status: eAPIResultStatus.Failure,
        };
      }

      const otp = await generateOtp(6);
      const expiry_time = new Date();
      expiry_time.setMinutes(expiry_time.getMinutes() + 1);

      const newOtp = new this.otpModel({
        email,
        otp,
        expiry_time,
        role: Role.Helper,
      });

      await newOtp.save();

      // sendEmail
      sendEmail({
        to: helper?.email,
        subject: 'Request For New Password',
        message: `OTP ของคุณ คือ ${otp}. รหัสจาก Mindhome นี้จะหมดอายุภายใน 1นาที`,
      });
      return {
        status: eAPIResultStatus.Success,
      };
    } catch (error) {
      return {
        invalidEmailError: false,
        status: eAPIResultStatus.Failure,
      };
    }
  }

  async validateOtp(req: VerifyOTPRequestDTO): Promise<VerifyOTPResponseDTO> {
    const { email, OTP } = req;
    try {
      if (!OTP) {
        return {
          otpRequired: true,
          status: eAPIResultStatus.Failure,
        };
      }
      const helper = await this.userModel.findOne({ email, role: Role.Helper });
      if (!helper) {
        return {
          invalidEmailError: true,
          status: eAPIResultStatus.Failure,
        };
      }

      const OtpRecord: any = await this.otpModel
        .findOne({ email, role: Role.Helper })
        .sort({ create_date: -1 })
        .exec();

      if (!OtpRecord) {
        return {
          invalidOTPError: true,
          status: eAPIResultStatus.Failure,
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
          invalidOTPError: true,
          status: eAPIResultStatus.Failure,
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

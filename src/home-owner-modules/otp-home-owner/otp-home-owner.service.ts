import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  dateFormatter,
  generateOtp,
  validateOtp,
} from 'src/utils/globalFunctions';
import { sendEmail } from 'src/utils/services/email.service';
import { eAPIResultStatus, Role } from 'src/utils/enum';
import { Otp } from 'src/entitites/otp';
import { SendOtpRequestDTO } from 'src/dtos/otp-dto/request/send-otp-request.dto';
import { User } from 'src/entitites/user';
import { SendOTPResponseDTO } from 'src/dtos/otp-dto/response/send-otp-response.dto';
import { CustomValidationException } from 'src/customExceptions/validation-exception';
import { VerifyOTPRequestDTO } from 'src/dtos/otp-dto/request/verify-otp-request.dto';
import { VerifyOTPResponseDTO } from 'src/dtos/otp-dto/response/verify-otp-response.dto';
import { UserSignupRequestDTO } from 'src/dtos/user-dto/request/signup.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Token, TokenDocument } from 'src/entitites/user-token';

@Injectable()
export class OtpHomeOwnerService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    @InjectModel(User.name) private userModel: Model<User>,

    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,

    private jwtService: JwtService,
  ) {}

  async sendOTP(
    sendOtpRequestDTO: SendOtpRequestDTO,
  ): Promise<SendOTPResponseDTO> {
    try {
      const { email } = sendOtpRequestDTO;

      const homeOwner = await this.userModel.findOne({
        email,
        role: Role.Customer,
      });
      if (homeOwner) {
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
        role: Role.Customer,
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
    verifyOTPDTO: VerifyOTPRequestDTO,
  ): Promise<VerifyOTPResponseDTO> {
    try {
      const { email, OTP } = verifyOTPDTO;

      if (!OTP) {
        return {
          status: eAPIResultStatus.Failure,
          otpRequired: true,
        };
      }

      const existingHomeOwner = await this.userModel.findOne({
        email,
        role: Role.Customer,
      });
      if (existingHomeOwner) {
        return {
          status: eAPIResultStatus.Failure,
          isEmailExistsError: true,
        };
      }

      const OtpRecord: any = await this.otpModel
        .findOne({ email, role: Role.Customer })
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

      const existingAliasName = await this.userModel.findOne({
        alias_name: verifyOTPDTO.alias_name,
        role: Role.Customer,
      });
      if (existingAliasName) {
        return {
          status: eAPIResultStatus.Failure,
          isAliasNameExistError: true,
        };
      }

      verifyOTPDTO.isVerified = true;
      const resData = await this.createHomeOwner(verifyOTPDTO);
      if (resData?.status === eAPIResultStatus.Failure) {
        return { status: eAPIResultStatus.Failure };
      }

      const homeOwner = resData?.homeOwner;

      const payload = {
        email: homeOwner.email,
        _id: homeOwner._id,
        role: homeOwner.role,
      };

      const access_token = this.jwtService.sign(payload);

      await this.tokenModel.create({ user_id: homeOwner._id, access_token });

      return {
        status: eAPIResultStatus.Success,
        User: resData?.homeOwner,
        accessToken: access_token,
      };
    } catch (error) {
      return {
        status: eAPIResultStatus.Failure,
      };
    }
  }

  async createHomeOwner(userSignupRequestDTO: UserSignupRequestDTO) {
    if (userSignupRequestDTO.password) {
      const hashedPassword = await bcrypt.hash(
        userSignupRequestDTO.password,
        12,
      );
      userSignupRequestDTO.password = hashedPassword;
    }

    const user = new this.userModel(userSignupRequestDTO);

    const savedHomeOwner = await user.save();

    if (savedHomeOwner) {
      return { status: eAPIResultStatus.Success, homeOwner: savedHomeOwner };
    }

    return {
      status: eAPIResultStatus.Success,
    };
  }
}

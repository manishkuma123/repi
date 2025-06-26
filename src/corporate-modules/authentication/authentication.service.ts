import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { UserSigninRequestDTO } from 'src/dtos/user-dto/request/signin.dto';
import { UserSigninResponseDTO } from 'src/dtos/user-dto/response/signin.dto';
import { User, UserDocument } from 'src/entitites/user';
import { PhoneNoOtpHelperService } from 'src/helper-modules/phone-no-otp-helper/phone-no-otp-helper.service';
import { eAPIResultStatus, LoginStatus, LoginType, Role } from 'src/utils/enum';
import { PhoneNoOtpService } from '../phone-no-otp/phone-no-otp.service';
import { VerifyPhoneNoOTPRequestDTO } from 'src/dtos/phone-no-otp/request/verify-otp';
import { Token } from 'aws-sdk';
import { TokenDocument } from 'src/entitites/user-token';
import {
  LoginAttempts,
  LoginAttemptsDocument,
} from 'src/entitites/login-attempts';
import { JwtService } from '@nestjs/jwt';
import { CreateLoginAttemptDTO } from 'src/dtos/login-attempt/create-login-attempt.dto';
import { sendEmail } from 'src/utils/services/email.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,

    @InjectModel(LoginAttempts.name)
    private loginAttemptsModel: Model<LoginAttemptsDocument>,

    private jwtService: JwtService,

    private readonly phoneNoOtpService: PhoneNoOtpService,
  ) {}
  async login(
    userSigninRequestDTO: UserSigninRequestDTO,
  ): Promise<ResponseDTO> {
    try {
      const { phone_no, country_code } = userSigninRequestDTO;

      const corporator = await this.userModel.findOne({
        phone_no,
        country_code,
        role: Role.Corporator,
      });

      if (!corporator) {
        return {
          status: eAPIResultStatus.Failure,
          message: 'Corporator not found',
        };
      }

      //send otp
      const resData = await this.phoneNoOtpService.createOtpForLogin({
        phone_no,
        country_code,
      });

      if (resData?.status == eAPIResultStatus.Failure) {
        return resData;
      }

      return {
        status: eAPIResultStatus.Success,
        data: resData.data,
        message: 'OTP sent successfully',
      };
    } catch (error) {
      console.error('Error during login:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Something went wrong.',
      };
    }
  }

  async verifyPhoneNoOTPForLogin(
    userSigninRequestDTO: VerifyPhoneNoOTPRequestDTO,
  ): Promise<ResponseDTO> {
    try {
      const { phone_no, country_code, otp } = userSigninRequestDTO;

      const corporator = await this.userModel.findOne({
        phone_no,
        country_code,
        role: Role.Corporator,
      });

      if (!corporator) {
        return {
          status: eAPIResultStatus.Failure,
          message: 'Corporator not found',
        };
      }

      //verify otp
      const dto = {
        phone_no,
        country_code,
        otp,
      };
      const resData =
        await this.phoneNoOtpService.verifyPhoneNoOTPForLogin(dto);

      if (resData?.status == eAPIResultStatus.Failure) {
        return resData;
      }

      const LoginAttemptsBody = {
        user_id: '' + corporator._id,
        login_type: LoginType.Email,
      };
      const loginAttempt =
        await this.createLoginAttemptRecord(LoginAttemptsBody);

      if (!corporator.isVerified) {
        await this.updateLoginStatus(
          '' + loginAttempt._id,
          LoginStatus.Success,
        );

        corporator.last_login = new Date();
        await corporator.save();

        return {
          status: eAPIResultStatus.Success,
          data: {
            user_id: '' + corporator?._id,
            role: '' + corporator?.role,
          },
          message: 'Corporator not verified',
        };
      }

      const payload = {
        _id: corporator._id,
        role: corporator.role,
      };

      const access_token = this.jwtService.sign(payload);

      await this.createTokenRecord('' + corporator._id, access_token);
      await this.updateLoginStatus('' + loginAttempt._id, LoginStatus.Success);

      corporator.last_login = new Date();
      await corporator.save();

      return {
        status: eAPIResultStatus.Success,
        data: {
          accessToken: access_token,
          isVerified: true,
          user_id: '' + corporator._id,
          step: '' + corporator?.step,
          points: corporator?.points,
          role: '' + corporator?.role,
        },
        message: 'Login successful',
      };
    } catch (error) {
      console.error('Error during login:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Something went wrong.',
      };
    }
  }

  async createLoginAttemptRecord(createLoginAttemptDto: CreateLoginAttemptDTO) {
    try {
      return await this.loginAttemptsModel.create(createLoginAttemptDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async createTokenRecord(user_id: string, access_token: string) {
    try {
      return await this.tokenModel.create({ user_id, access_token });
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateLoginStatus(_id: string, status: string) {
    try {
      return await this.loginAttemptsModel.findOneAndUpdate(
        { _id },
        { status },
        { new: true },
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  async sendEmailToCorporator(email: string) {
    try {
      sendEmail({
        to: email,
        subject: 'Corporate Registration Completed - MindHome',
        message: `ขอบคุณที่ลงทะเบียนกับ MindHome สำหรับบัญชีองค์กรของคุณ การลงทะเบียนเสร็จสมบูรณ์แล้ว และทีมของเราจะติดต่อกลับไปในไม่ช้า หากคุณมีคำถามเพิ่มเติม กรุณาติดต่อทีมสนับสนุนของเรา`,
      });
    } catch (error) {
      return { status: eAPIResultStatus.Success };
    }
  }
}

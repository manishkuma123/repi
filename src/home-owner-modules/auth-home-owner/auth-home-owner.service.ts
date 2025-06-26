import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { HomeOwner, HomeOwnerDocument } from './entities/home-owner.entity';
import { CreateHomeOwnerDTO } from './dto/request/create-home-owner.dto';
import { LoginHomeOwnerDto } from './dto/request/login-home-owner.dto';
import { comparePassword } from 'src/utils/validationFuctions';
import { LoginHomeOwnerResponseDTO } from './dto/response/login-response.dto';
import { eAPIResultStatus, LoginStatus, LoginType, Role } from 'src/utils/enum';
import { CreateHomeOwnerResponseDTO } from './dto/response/create-home-owner-response.dto';
import { UpdatePasswordRequestDTO } from '../../dtos/user-dto/request/update-password-request.dto';
import { UpdatePasswordResponseDTO } from '../../dtos/user-dto/response/update-password-response.dto';
import { GoogleLoginResponseDTO } from '../../dtos/user-dto/response/google-login-response.dto';
import { GoogleLoginDTO } from '../../dtos/user-dto/request/google-login.dto';
import { AppleLoginResponseDTO } from '../../dtos/user-dto/response/apple-login-response.dto';
import { AppleLoginDTO } from '../../dtos/user-dto/request/apple-login-.dto';
import { JwksClient } from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { UserSignupRequestDTO } from 'src/dtos/user-dto/request/signup.dto';
import { User, UserDocument } from 'src/entitites/user';
import { CustomUnauthorizedException } from 'src/customExceptions/un-authorize.exception';
import { CustomValidationException } from 'src/customExceptions/validation-exception';
import { UserSignupResponseDTO } from 'src/dtos/user-dto/response/signup.dto';
import { UserSigninRequestDTO } from 'src/dtos/user-dto/request/signin.dto';
import { UserSigninResponseDTO } from 'src/dtos/user-dto/response/signin.dto';
import { Token, TokenDocument } from 'src/entitites/user-token';
import {
  LoginAttempts,
  LoginAttemptsDocument,
} from 'src/entitites/login-attempts';
import { CreateLoginAttemptDTO } from 'src/dtos/login-attempt/create-login-attempt.dto';
import { PhoneNoOtpHomeOwnerService } from '../phone-no-otp-home-owner/phone-no-otp-home-owner.service';
import { Complaint, ComplaintDocument } from 'src/entitites/complaints';
import { ExtendedJob, ExtendedJobDocument } from 'src/entitites/extended-job';
import {
  HomeOwnerAddress,
  HomeOwnerAddressDocument,
} from 'src/entitites/home-owner-address';
import { Otp, OtpDocument } from 'src/entitites/otp';
import { PasswordOtp, PasswordOtpDocument } from 'src/entitites/password-otp';
import { PhoneNoOtp, PhoneNoOtpDocument } from 'src/entitites/phone-no-otp';
import {
  ScheduledJob,
  ScheduledJobDocument,
} from 'src/entitites/scheduled-job';
import { SearchJob, SearchJobDocument } from 'src/entitites/search-job';
import { Suggestion, SuggestionDocument } from 'src/entitites/suggestion';
import { HelperOffer, HelperOfferDocument } from 'src/entitites/helper-offer';
import { Notification, NotificationDocument } from 'src/entitites/notification';
import { UpdateHomeOwnerDTO } from './dto/request/update-home-owner.dto';
import { UpdateHomeOwnerResponseDTO } from './dto/response/update-home-owner.dto';
import { ChangePasswordDTO } from './dto/request/change-password.dto';
import { ChangePasswordResponseDTO } from './dto/response/change-password.dto';
import { getCustomerAvgRatingAndTotalRating } from 'src/utils/globalFunctions';
import { VerifyPhoneNoOTPRequestDTO } from 'src/dtos/phone-no-otp/request/verify-otp';

@Injectable()
export class AuthHomeOwnerService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,

    @InjectModel(LoginAttempts.name)
    private loginAttemptsModel: Model<LoginAttemptsDocument>,

    @InjectModel(Complaint.name)
    private complaintModel: Model<ComplaintDocument>,

    @InjectModel(HomeOwnerAddress.name)
    private homeOwnerAddressModel: Model<HomeOwnerAddressDocument>,

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

    @InjectModel(HelperOffer.name)
    private helperOfferModel: Model<HelperOfferDocument>,

    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,

    private jwtService: JwtService,

    private phoneNumberHomeOwnerService: PhoneNoOtpHomeOwnerService,
  ) {}

  private APPLE_BASE_URL = 'https://appleid.apple.com';
  private JWKS_APPLE_URI = '/auth/keys';

  async signup(
    userSignupRequestDTO: UserSignupRequestDTO,
  ): Promise<UserSignupResponseDTO> {
    try {
      // const existingHomeOwner = await this.userModel.findOne({
      //   email: userSignupRequestDTO?.email,
      //   role: Role.Customer,
      // });

      // if (existingHomeOwner) {
      //   return { status: eAPIResultStatus.Failure, isEmailExistError: true };
      // }

      if (userSignupRequestDTO?.alias_name) {
        const existingAliasName = await this.userModel.findOne({
          alias_name: userSignupRequestDTO?.alias_name,
          role: Role.Customer,
        });
        if (existingAliasName) {
          return {
            status: eAPIResultStatus.Failure,
            isAliasNameExistError: true,
          };
        }
      }

      const resData = await this.phoneNumberHomeOwnerService.createOtp({
        phone_no: userSignupRequestDTO.phone_no,
        country_code: userSignupRequestDTO.country_code,
      });
      if (resData?.status === eAPIResultStatus.Failure) {
        if (resData?.isPhoneNoExistError) {
          return {
            status: eAPIResultStatus.Failure,
            isPhoneNoExistError: true,
          };
        }
        return { status: eAPIResultStatus.Failure };
      }
      return { status: eAPIResultStatus.Success };
    } catch (error) {
      throw new CustomValidationException(error.message);
    }
  }

  async sendOtpForlogin(
    userSigninRequestDTO: UserSigninRequestDTO,
  ): Promise<UserSigninResponseDTO> {
    try {
      const { phone_no, country_code } = userSigninRequestDTO;

      const homeOwner = await this.userModel.findOne({
        phone_no,
        country_code,
        role: Role.Customer,
      });

      if (!homeOwner) {
        return {
          status: eAPIResultStatus.Failure,
          incorrectCredentialsError: false,
          userExistsError: true,
          isVerified: false,
        };
      }

      //send otp
      const resData = await this.phoneNumberHomeOwnerService.createOtpForLogin({
        phone_no,
        country_code,
      });

      if (resData?.status === eAPIResultStatus.Failure) {
        if (resData?.invalidPhoneError) {
          return {
            status: eAPIResultStatus.Failure,
            invalidPhoneNoError: true,
          };
        }
        return { status: eAPIResultStatus.Failure };
      }

      return {
        status: eAPIResultStatus.Success,
        data: resData?.data,
      };
    } catch (error) {
      throw new CustomValidationException(error.message);
    }
  }

  async verifyOtpForLogin(
    verifyPhoneNoOTPRequestDTO: VerifyPhoneNoOTPRequestDTO,
  ): Promise<UserSigninResponseDTO> {
    try {
      const { phone_no, country_code, otp } = verifyPhoneNoOTPRequestDTO;

      const homeOwner = await this.userModel.findOne({
        phone_no,
        country_code,
        role: Role.Customer,
      });

      if (!homeOwner) {
        return {
          status: eAPIResultStatus.Failure,
          incorrectCredentialsError: false,
          userExistsError: true,
          isVerified: false,
        };
      }

      const dto = {
        phone_no,
        country_code,
        otp,
        role: '' + Role.Customer,
      };
      const verifyOtpResponseData =
        await this.phoneNumberHomeOwnerService.verifyPhoneNoOTPForLogin(dto);

      if (verifyOtpResponseData?.status == eAPIResultStatus.Failure) {
        return verifyOtpResponseData;
      }

      const LoginAttemptsBody = {
        user_id: '' + homeOwner._id,
        login_type: LoginType.Email,
      };
      const loginAttempt =
        await this.createLoginAttemptRecord(LoginAttemptsBody);

      if (!homeOwner.isVerified) {
        await this.updateLoginStatus(
          '' + loginAttempt._id,
          LoginStatus.Success,
        );

        homeOwner.last_login = new Date();
        await homeOwner.save();

        return {
          incorrectCredentialsError: false,
          userExistsError: false,
          isVerified: false,
          status: eAPIResultStatus.Success,
          user_id: '' + homeOwner?._id,
        };
      }

      const payload = {
        _id: homeOwner._id,
        role: homeOwner.role,
      };

      const access_token = this.jwtService.sign(payload);

      await this.createTokenRecord('' + homeOwner._id, access_token);
      await this.updateLoginStatus('' + loginAttempt._id, LoginStatus.Success);

      homeOwner.last_login = new Date();
      await homeOwner.save();

      return {
        status: eAPIResultStatus.Success,
        accessToken: access_token,
        isVerified: true,
        user_id: '' + homeOwner?._id,
      };
    } catch (error) {
      throw new CustomValidationException(error.message);
    }
  }

  async changePassword(
    loginHomeOwnerDto: UpdatePasswordRequestDTO,
  ): Promise<UpdatePasswordResponseDTO> {
    try {
      const { email, password } = loginHomeOwnerDto;
      const homeOwner = await this.userModel.findOne({
        email,
        role: Role.Customer,
      });
      if (!homeOwner) {
        return {
          status: eAPIResultStatus.Failure,
          incorrectCredentialsError: true,
        };
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      homeOwner.password = hashedPassword;

      await homeOwner.save();

      return {
        status: eAPIResultStatus.Success,
      };
    } catch (error) {
      return {
        status: eAPIResultStatus.Failure,
      };
    }
  }

  async googleSignUp(dto: GoogleLoginDTO): Promise<GoogleLoginResponseDTO> {
    try {
      const { email } = dto;
      let user = await this.userModel.findOne({ email, role: Role.Customer });

      if (!user) {
        const newUser = new this.userModel({
          email,
          role: Role.Customer,
          isVerified: true,
          last_login: new Date(),
        });
        const savedHomeOwner = await newUser.save();

        const LoginAttemptsBody = {
          user_id: '' + savedHomeOwner._id,
          login_type: LoginType.Google,
          status: LoginStatus.Success,
        };
        const loginAttempt =
          await this.createLoginAttemptRecord(LoginAttemptsBody);

        const payload = {
          email: savedHomeOwner.email,
          _id: savedHomeOwner._id,
          role: savedHomeOwner.role,
        };

        const access_token = this.jwtService.sign(payload);

        await this.createTokenRecord('' + savedHomeOwner._id, access_token);

        return {
          status: eAPIResultStatus.Success,
          isNewUser: true,
          isVerified: true,
          accessToken: access_token,
          user_id: '' + savedHomeOwner._id,
        };
      }

      const LoginAttemptsBody = {
        user_id: '' + user._id,
        login_type: LoginType.Google,
        status: LoginStatus.Success,
      };

      const loginAttempt =
        await this.createLoginAttemptRecord(LoginAttemptsBody);

      user.last_login = new Date();
      await user.save();

      if (!user?.isVerified) {
        return {
          status: eAPIResultStatus.Success,
          isVerified: false,
          user_id: '' + user?._id,
        };
      }

      const payload = {
        email: user.email,
        _id: user._id,
        role: user.role,
      };

      const access_token = this.jwtService.sign(payload);

      await this.createTokenRecord('' + user._id, access_token);

      return {
        status: eAPIResultStatus.Success,
        isVerified: true,
        accessToken: access_token,
        user_id: '' + user?._id,
      };
    } catch (error) {
      console.error('An error occurred:', error);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async appleAuthentication(
    dto: AppleLoginDTO,
  ): Promise<AppleLoginResponseDTO> {
    try {
      const { identityToken } = dto;
      console.log('ReqToken is: ', identityToken);
      let response: AppleLoginResponseDTO;

      const decodedToken = this.jwtService.decode(identityToken, {
        complete: true,
      });
      const { kid, alg } = decodedToken.header;

      const client = new JwksClient({
        jwksUri: `${this.APPLE_BASE_URL}/${this.JWKS_APPLE_URI}`,
      });
      const signingKey = await client.getSigningKey(kid);

      const publicKey = signingKey.getPublicKey();
      const publicKid = signingKey.kid;
      const publicAlg = signingKey.alg;

      if (publicAlg !== alg) {
        throw new Error('the alg does not match with jwk config.');
      }
      if (publicKid !== kid) {
        throw new Error('the kid does not match with Apple auth keys');
      }

      const verifiedToken = jwt.verify(identityToken, publicKey, {
        algorithms: [alg],
      });

      if (typeof verifiedToken === 'object' && verifiedToken !== null) {
        let user = await this.userModel.findOne({
          email: verifiedToken.email,
          role: Role.Customer,
        });
        if (!user) {
          const newUser = new this.userModel({
            email: verifiedToken.email,
            password: '12345',
            isVerified: true,
            phoneNumber: '',
            role: Role.Customer,
            last_login: new Date(),
          });
          const newRecord = await newUser.save();

          const LoginAttemptsBody = {
            user_id: '' + newRecord._id,
            login_type: LoginType.Apple,
            status: LoginStatus.Success,
          };
          const loginAttempt =
            await this.createLoginAttemptRecord(LoginAttemptsBody);

          const payload = {
            email: newRecord.email,
            _id: newRecord._id,
            role: newRecord.role,
          };
          const access_token = this.jwtService.sign(payload);
          await this.createTokenRecord('' + newRecord._id, access_token);

          return {
            status: eAPIResultStatus.Success,
            isNewUser: true,
            accessToken: access_token,
            isVerified: true,
            user_id: '' + newRecord._id,
          };
        } else {
          const LoginAttemptsBody = {
            user_id: '' + user._id,
            login_type: LoginType.Apple,
            status: LoginStatus.Success,
          };

          const loginAttempt =
            await this.createLoginAttemptRecord(LoginAttemptsBody);

          user.last_login = new Date();
          await user.save();

          if (!user?.isVerified) {
            return {
              status: eAPIResultStatus.Success,
              isVerified: false,
              user_id: '' + user?._id,
            };
          }

          const payload = {
            email: user.email,
            _id: user._id,
            role: user.role,
          };
          const access_token = this.jwtService.sign(payload);
          await this.createTokenRecord('' + user._id, access_token);

          return {
            status: eAPIResultStatus.Success,
            accessToken: access_token,
            isVerified: true,
            user_id: '' + user?._id,
          };
        }
      }

      return response;
    } catch (error) {
      console.error('An error occurred:', error);
      return {
        status: eAPIResultStatus.Failure,
      };
    }
  }

  async createTokenRecord(user_id: string, access_token: string) {
    try {
      return await this.tokenModel.create({ user_id, access_token });
    } catch (error) {
      throw new Error(error);
    }
  }

  async createLoginAttemptRecord(createLoginAttemptDto: CreateLoginAttemptDTO) {
    try {
      return await this.loginAttemptsModel.create(createLoginAttemptDto);
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

  async getHomeOwner(_id: string) {
    try {
      let address = {};
      const user = await this.userModel
        .findOne({ _id, role: Role.Customer })
        .lean();

      if (user?.address) {
        address = await this.homeOwnerAddressModel.findOne({
          _id: user?.address,
        });
      }

      const ratedJobs = await this.scheduledJobModel.find({
        customer_id: '' + _id,
        customer_rating: { $exists: true },
      });

      const { totalNoOfRatedJobs, avgRating } =
        getCustomerAvgRatingAndTotalRating(ratedJobs);
      return {
        status: eAPIResultStatus.Success,
        user: {
          ...user,
          address: address ?? null,
          totalNoOfRatedJobs,
          rating: avgRating,
        },
      };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async deleteHomeOwner(_id: string) {
    try {
      //get Home Owner
      const homeOwner = await this.userModel.findById(_id);

      //delete home owner
      await this.userModel.deleteOne({ _id });

      //delete home owner addresses
      await this.homeOwnerAddressModel.deleteMany({
        user_id: _id,
      });

      //delete home owner complaint
      await this.complaintModel.deleteMany({ user_id: _id });

      //update All homeOwnerz's jobs
      await this.searchJobModel.updateMany(
        { customer_id: _id },
        {
          $set: {
            customer_id: null,
          },
        },
      );

      ///delete login attempts data
      await this.loginAttemptsModel.deleteMany({ user_id: _id });

      //delete homeOwner otp
      await this.otpModel.deleteMany({
        email: homeOwner?.email,
        role: Role.Customer,
      });

      //delete password otp
      await this.passwordOtpModel.deleteMany({
        email: homeOwner?.email,
        role: Role.Customer,
      });

      //delete phone No Otp
      await this.phoneNoOtpModel.deleteMany({
        country_code: homeOwner?.country_code,
        phone_no: homeOwner?.phone_no,
        role: Role.Customer,
      });

      //update scheduled Jobs
      await this.scheduledJobModel.updateMany(
        { customer_id: _id },
        {
          $set: {
            customer_id: null,
          },
        },
      );

      //delete all suggestions
      await this.suggestionModel.deleteMany({ user_id: _id });

      //delete all token
      await this.tokenModel.deleteMany({ user_id: _id });

      //update helper offer
      await this.helperOfferModel.updateMany(
        { customer_id: _id },
        {
          $set: {
            customer_id: null,
          },
        },
      );

      //delete notifications
      await this.notificationModel.deleteMany({
        $or: [{ sender_id: _id }, { receiver_id: _id }],
      });

      return { status: eAPIResultStatus.Success };
    } catch (error) {
      console.log('error :: ', error);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async updateHomeOwner(
    homeOwnerId: string,
    updateHomeOwnerDto: UpdateHomeOwnerDTO,
  ): Promise<UpdateHomeOwnerResponseDTO> {
    try {
      const homeOwner = await this.userModel.findOne({
        _id: homeOwnerId,
        role: Role.Customer,
      });
      if (!homeOwner) {
        return { status: eAPIResultStatus.Failure, invalidHomeOwnerId: true };
      }

      if (
        updateHomeOwnerDto?.alias_name &&
        updateHomeOwnerDto?.alias_name != homeOwner?.alias_name
      ) {
        const existingHomeOwner = await this.userModel.findOne({
          alias_name: updateHomeOwnerDto?.alias_name,
          role: Role.Customer,
        });
        if (existingHomeOwner) {
          return {
            status: eAPIResultStatus.Failure,
            aliasNameExistError: true,
          };
        }
      }
      await this.userModel.updateOne(
        { _id: homeOwnerId },
        {
          $set: {
            alias_name: updateHomeOwnerDto?.alias_name,
            phone_no: updateHomeOwnerDto?.phone_no,
            country_code: updateHomeOwnerDto?.country_code,
            profile_url: updateHomeOwnerDto?.profile_url,
            address: updateHomeOwnerDto?.address?._id?.toString(),
            push_notification_enabled:
              updateHomeOwnerDto?.push_notification_enabled,
          },
        },
      );

      if (updateHomeOwnerDto?.address) {
        const homeOwnerAddress = await this.homeOwnerAddressModel.findOne({
          _id: updateHomeOwnerDto?.address?._id,
        });
        if (homeOwnerAddress) {
          await this.homeOwnerAddressModel.updateOne(
            { _id: homeOwnerAddress._id },
            { $set: { ...updateHomeOwnerDto?.address } },
          );
        }
      }
      return { status: eAPIResultStatus.Success };
    } catch (error) {
      console.log('error :: ', error);
      return { status: eAPIResultStatus.Failure };
    }
  }
async getAllUsers(): Promise<User[]> {
  return this.userModel.find().exec();
}

  async changePasswordWhenLogin(
    homeOwnerId: string,
    changePasswordDto: ChangePasswordDTO,
  ): Promise<ChangePasswordResponseDTO> {
    try {
      const homeOwner = await this.userModel.findOne({
        _id: homeOwnerId,
        role: Role.Customer,
      });
      if (!homeOwner) {
        return { status: eAPIResultStatus.Failure, invalidHomeOwnerId: true };
      }
      const isPasswordMatch = await comparePassword(
        changePasswordDto?.old_password,
        homeOwner?.password,
      );
      if (!isPasswordMatch) {
        return { status: eAPIResultStatus.Failure, invalidOldPassword: true };
      }

      if (
        changePasswordDto?.new_password !== changePasswordDto?.confirm_password
      ) {
        return {
          status: eAPIResultStatus.Failure,
          confirmPasswordNotMatch: true,
        };
      }

      const hashedPassword = await bcrypt.hash(
        changePasswordDto?.new_password,
        12,
      );
      homeOwner.password = hashedPassword;
      await homeOwner.save();
      return { status: eAPIResultStatus.Success };
    } catch (error) {
      console.log('error :: ', error);
      return { status: eAPIResultStatus.Failure };
    }
  }
}

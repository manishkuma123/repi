import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { countryMap } from '../types/constants';
import { User, UserDocument } from 'src/entitites/user';
import { UserSignupRequestDTO } from 'src/dtos/user-dto/request/signup.dto';
import { UserSignupResponseDTO } from 'src/dtos/user-dto/response/signup.dto';
import { CustomValidationException } from 'src/customExceptions/validation-exception';
import { eAPIResultStatus, LoginStatus, LoginType, Role } from 'src/utils/enum';
import { UserSigninRequestDTO } from 'src/dtos/user-dto/request/signin.dto';
import { UserSigninResponseDTO } from 'src/dtos/user-dto/response/signin.dto';
import { Token, TokenDocument } from 'src/entitites/user-token';
import {
  LoginAttempts,
  LoginAttemptsDocument,
} from 'src/entitites/login-attempts';
import { comparePassword } from 'src/utils/validationFuctions';
import { CreateLoginAttemptDTO } from 'src/dtos/login-attempt/create-login-attempt.dto';
import { UpdatePasswordRequestDTO } from 'src/dtos/user-dto/request/update-password-request.dto';
import { HelperSignupRequestDTO } from 'src/dtos/user-dto/request/helper-signup.dto';
import { JwksClient } from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { GoogleLoginDTO } from 'src/dtos/user-dto/request/google-login.dto';
import { GoogleLoginResponseDTO } from 'src/dtos/user-dto/response/google-login-response.dto';
import { AppleLoginDTO } from 'src/dtos/user-dto/request/apple-login-.dto';
import { AppleLoginResponseDTO } from 'src/dtos/user-dto/response/apple-login-response.dto';
import { CreateHelperRequestDTO } from './dto/request/create-helper-dto';
import { CreateHelperResponseDTO } from './dto/response/create-helper.dto';
import { SkilHelperService } from '../expertise-helper/skill-helper.service';
import { IdentityCardHelperService } from '../identity-card-helper/identity-card-helper.service';
import { HelperBankDetailsService } from '../helper-bank-details/helper-bank-details.service';
import { HelperCriminalHistoryCheckService } from '../helper-criminal-history-check/helper-criminal-history-check.service';
import { ForeignPassportHelperService } from '../foreign-passport-helper/foreign-passport-helper.service';
import { GeoLocationService } from 'src/helper-modules/geo-location/geo-location.service';
import { PhoneNoOtpHelperService } from '../phone-no-otp-helper/phone-no-otp-helper.service';
import { CreateHelperDetailsRequestDTO } from './dto/request/create-helper-details.dto';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import {
  InvitedHelper,
  InvitedHelperDocument,
} from 'src/entitites/invited-helpers';
import {
  GeoLocationDetails,
  GeoLocationDetailsDocument,
} from 'src/entitites/geo-location';
import { CheckPhoneNoResponseDTO } from './dto/response/check-phone-no-dto';
import { count } from 'console';
import { CheckPhoneNoRequestDTO } from './dto/request/check-phone-no.dto';
import { VerifyPhoneNoOTPRequestDTO } from 'src/dtos/phone-no-otp/request/verify-otp';
import { ConfigurationService } from 'src/modules/configuration/configuration.service';

@Injectable()
export class AuthHelperService {
  private APPLE_BASE_URL = 'https://appleid.apple.com';
  private JWKS_APPLE_URI = '/auth/keys';

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,

    @InjectModel(LoginAttempts.name)
    private loginAttemptsModel: Model<LoginAttemptsDocument>,

    @InjectModel(InvitedHelper.name)
    private invitedHelperModel: Model<InvitedHelperDocument>,

    @InjectModel(GeoLocationDetails.name)
    private geoLocationDetailsModel: Model<GeoLocationDetailsDocument>,

    private jwtService: JwtService,

    private skillhHelperService: SkilHelperService,
    private identityCardHelperService: IdentityCardHelperService,
    private foreignPassportHelperService: ForeignPassportHelperService,
    private helperBankDetailsService: HelperBankDetailsService,
    private helperCriminalHistoryCheckService: HelperCriminalHistoryCheckService,
    private helperGeoLocation: GeoLocationService,

    private phoneNoHelperOtpService: PhoneNoOtpHelperService,
    private readonly configurationService: ConfigurationService,

    @InjectConnection() private readonly connection: Connection,
  ) {}

  // Signup

  async signup(
    createHelperDto: HelperSignupRequestDTO,
  ): Promise<UserSignupResponseDTO> {
    try {
      // const existingHelper = await this.userModel.findOne({
      //   email: createHelperDto?.email,
      //   role: { $in: [Role.Corporator, Role.Helper] },
      // });

      // if (existingHelper) {
      //   return { status: eAPIResultStatus.Failure, isEmailExistError: true };
      // }

      const existingProfileName = await this.userModel.findOne({
        profile_name: createHelperDto?.profile_name,
        role: { $in: [Role.Corporator, Role.Helper] },
      });
      if (existingProfileName) {
        return {
          status: eAPIResultStatus.Failure,
          isProfileNameExistError: true,
        };
      }

      const resData = await this.phoneNoHelperOtpService.createOtp({
        phone_no: createHelperDto.phone_no,
        country_code: createHelperDto.country_code,
        role: createHelperDto?.role ?? Role.Helper,
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
      return { status: eAPIResultStatus.Success, data: resData?.data };
    } catch (error) {
      throw new CustomValidationException(error.message);
    }
  }

  async login(
    userSigninRequestDTO: UserSigninRequestDTO,
  ): Promise<UserSigninResponseDTO> {
    try {
      const { phone_no, country_code } = userSigninRequestDTO;

      const helper = await this.userModel.findOne({
        phone_no,
        country_code,
        role: { $in: [Role.Helper, Role.Corporator] },
      });

      if (!helper) {
        return {
          status: eAPIResultStatus.Failure,
          incorrectCredentialsError: false,
          userExistsError: true,
          isVerified: false,
        };
      }

      //send otp
      const resData = await this.phoneNoHelperOtpService.createOtpForLogin({
        phone_no,
        country_code,
        role: '' + helper?.role,
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
      console.error('Error during login:', error);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async changePassword(updatePasswordRequestDTO: UpdatePasswordRequestDTO) {
    try {
      const { email, password } = updatePasswordRequestDTO;
      const helper = await this.userModel.findOne({
        email,
        role: Role.Helper,
      });
      if (!helper) {
        return {
          status: eAPIResultStatus.Failure,
          incorrectCredentialsError: true,
        };
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      helper.password = hashedPassword;

      await helper.save();

      return {
        status: eAPIResultStatus.Success,
      };
    } catch (error) {
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

  async googleSignUp(dto: GoogleLoginDTO): Promise<GoogleLoginResponseDTO> {
    try {
      const { email, profile_name } = dto;
      let user = await this.userModel.findOne({ email, role: Role.Helper });

      if (!user) {
        let existingUser = await this.userModel.findOne({
          profile_name,
          role: Role.Helper,
        });

        if (existingUser) {
          return {
            status: eAPIResultStatus.Failure,
            profileNameExists: true,
          };
        }

        const configuration: any =
          await this.configurationService.getConfiguration();
        const configData: any = configuration.data;
        const defaultWarrantyPeriod = parseInt(
          configData?.DEFAULT_WARRANTY_PERIOD,
        );

        const newUser = new this.userModel({
          email,
          profile_name,
          role: Role.Helper,
          isVerified: true,
          last_login: new Date(),
          defaultWarrantyPeriod: defaultWarrantyPeriod,
        });
        const savedHelper = await newUser.save();

        const LoginAttemptsBody = {
          user_id: '' + savedHelper._id,
          login_type: LoginType.Google,
          status: LoginStatus.Success,
        };
        const loginAttempt =
          await this.createLoginAttemptRecord(LoginAttemptsBody);

        const payload = {
          email: savedHelper.email,
          _id: savedHelper._id,
          role: savedHelper.role,
        };

        const access_token = this.jwtService.sign(payload);

        await this.createTokenRecord('' + savedHelper._id, access_token);

        return {
          status: eAPIResultStatus.Success,
          isNewUser: true,
          isVerified: true,
          accessToken: access_token,
          user_id: '' + savedHelper._id,
        };
      }

      // const user_location = await this.helperGeoLocation.getHelperLocation(
      //   '' + user?._id,
      // );
      if (!user?.profile_url || user?.profile_url === '') {
        const LoginAttemptsBody = {
          user_id: '' + user?._id,
          login_type: LoginType.Google,
          status: LoginStatus.Success,
        };
        const loginAttempt =
          await this.createLoginAttemptRecord(LoginAttemptsBody);

        const payload = {
          email: user?.email,
          _id: user?._id,
          role: user?.role,
        };

        const access_token = this.jwtService.sign(payload);

        await this.createTokenRecord('' + user?._id, access_token);

        return {
          status: eAPIResultStatus.Success,
          isNewUser: true,
          isVerified: true,
          accessToken: access_token,
          user_id: '' + user?._id,
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
          isNewUser: false,
          user_id: '' + user._id,
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
        isNewUser: false,
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
          role: Role.Helper,
        });
        if (!user) {
          const configuration: any =
            await this.configurationService.getConfiguration();
          const configData: any = configuration.data;
          const defaultWarrantyPeriod = parseInt(
            configData?.DEFAULT_WARRANTY_PERIOD,
          );

          const newUser = new this.userModel({
            email: verifiedToken.email,
            password: '12345',
            isVerified: true,
            phoneNumber: '',
            role: Role.Helper,
            last_login: new Date(),
            defaultWarrantyPeriod: defaultWarrantyPeriod,
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

  async deleteUser(email: string) {
    try {
      const user = await this.userModel.deleteOne({
        email,
        role: Role.Helper,
      });
      return { status: eAPIResultStatus.Success };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async createHelper(
    createHelperDTO: CreateHelperRequestDTO,
  ): Promise<CreateHelperResponseDTO> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const existingHelper = await this.userModel.findOne({
        $or: [
          { phone_no: createHelperDTO?.helper?.phone_no },
          { email: createHelperDTO?.helper?.email },
        ],

        role: Role.Helper,
      });

      if (existingHelper) {
        return { status: eAPIResultStatus.Failure };
      }
      const helperDTO = createHelperDTO?.helper;
      // if (helperDTO?.password) {
      //   const hashedPassword = await bcrypt.hash(helperDTO.password, 12);

      //   helperDTO.password = hashedPassword;
      // }

      helperDTO.role = Role.Helper;
      helperDTO.isVerified = true;

      const newHelper = new this.userModel(helperDTO);

      const helper = await newHelper.save();
      // helper.password = null;

      if (createHelperDTO?.helper?.location) {
        await this.helperGeoLocation.create(newHelper, {
          location: createHelperDTO?.helper?.location,
        });
      }

      if (
        createHelperDTO?.skills &&
        Object.keys(createHelperDTO.skills).length > 0
      ) {
        await this.skillhHelperService.createSkill(
          createHelperDTO?.skills,
          helper,
        );
      }

      if (
        createHelperDTO?.nationalIdentityData &&
        Object.keys(createHelperDTO.nationalIdentityData).length > 0
      ) {
        await this.identityCardHelperService.create(
          '' + helper?._id,
          createHelperDTO?.nationalIdentityData,
        );
      }

      if (
        createHelperDTO?.foreignIdentityData &&
        Object.keys(createHelperDTO.foreignIdentityData).length > 0
      ) {
        await this.foreignPassportHelperService.create(
          '' + helper?._id,
          createHelperDTO?.foreignIdentityData,
        );
      }

      if (
        createHelperDTO?.bankDetails &&
        Object.keys(createHelperDTO.bankDetails).length > 0
      ) {
        await this.helperBankDetailsService.create(
          '' + helper?._id,
          createHelperDTO?.bankDetails,
        );
      }

      if (
        createHelperDTO?.criminalHistory &&
        Object.keys(createHelperDTO.criminalHistory).length > 0
      ) {
        await this.helperCriminalHistoryCheckService.create(
          '' + helper?._id,
          createHelperDTO?.criminalHistory,
        );
      }

      const payload = {
        email: helper.email,
        _id: helper._id,
        role: helper.role,
      };

      const access_token = this.jwtService.sign(payload);

      await this.tokenModel.create({ user_id: helper._id, access_token });

      return {
        status: eAPIResultStatus.Success,
        accessToken: access_token,
        user: helper,
      };
    } catch (error) {
      console.log('---------------------------------------', error);
      session.abortTransaction();
      return { status: eAPIResultStatus.Failure };
    }
  }

  async createHelperDetails(
    helper_id: string,
    createHelperDTO: CreateHelperDetailsRequestDTO,
  ): Promise<CreateHelperResponseDTO> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const helper = await this.userModel.findById('' + helper_id);

      if (createHelperDTO?.location) {
        await this.helperGeoLocation.create(helper, {
          location: createHelperDTO?.location,
        });
      }

      if (createHelperDTO?.emergencyContact) {
        await this.userModel.updateOne(
          { _id: helper_id },
          { $set: { emergency_contact: createHelperDTO?.emergencyContact } },
        );
      }

      if (createHelperDTO?.profile_url) {
        await this.userModel.updateOne(
          { _id: helper_id },
          { $set: { profile_url: createHelperDTO?.profile_url } },
        );
      }
      if (
        createHelperDTO?.skills &&
        Object.keys(createHelperDTO.skills).length > 0
      ) {
        await this.skillhHelperService.createSkill(
          createHelperDTO?.skills,
          helper,
        );
      }

      if (
        createHelperDTO?.nationalIdentityData &&
        Object.keys(createHelperDTO.nationalIdentityData).length > 0
      ) {
        await this.identityCardHelperService.create(
          '' + helper?._id,
          createHelperDTO?.nationalIdentityData,
        );
      }

      if (
        createHelperDTO?.foreignIdentityData &&
        Object.keys(createHelperDTO.foreignIdentityData).length > 0
      ) {
        await this.foreignPassportHelperService.create(
          '' + helper?._id,
          createHelperDTO?.foreignIdentityData,
        );
      }

      if (
        createHelperDTO?.bankDetails &&
        Object.keys(createHelperDTO.bankDetails).length > 0
      ) {
        await this.helperBankDetailsService.create(
          '' + helper?._id,
          createHelperDTO?.bankDetails,
        );
      }

      if (
        createHelperDTO?.criminalHistory &&
        Object.keys(createHelperDTO.criminalHistory).length > 0
      ) {
        await this.helperCriminalHistoryCheckService.create(
          '' + helper?._id,
          createHelperDTO?.criminalHistory,
        );
      }

      // helper.password = null;
      return {
        status: eAPIResultStatus.Success,
        user: helper,
      };
    } catch (error) {
      console.log('Error', error);
      session.abortTransaction();
      return { status: eAPIResultStatus.Failure };
    }
  }

  async tryLoginNewCorporateHelper(invitedHelper: InvitedHelper) {
    const resData = await this.phoneNoHelperOtpService.createOtp({
      phone_no: invitedHelper.phone_no,
      country_code: '+' + invitedHelper.country_code,
      role: '' + Role.Helper,
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

    return {
      status: eAPIResultStatus.Success,
      isNewCorporateHelper: true,
      corporateHelper: invitedHelper,
    };
  }

  // async newCorporateHelperSignup(createHelperDto: HelperSignupRequestDTO) {
  //   try {
  //     let existingHelper = await this.userModel.findOne({
  //       email: createHelperDto?.email,
  //       role: { $in: [Role.Corporator, Role.Helper] },
  //     });

  //     if (existingHelper) {
  //       return { status: eAPIResultStatus.Failure, isEmailExistError: true };
  //     }

  //     existingHelper = await this.userModel.findOne({
  //       phone_no: createHelperDto?.phone_no,
  //       country_code: createHelperDto?.country_code,
  //       role: { $in: [Role.Corporator, Role.Helper] },
  //     });
  //     if (existingHelper) {
  //       return {
  //         status: eAPIResultStatus.Failure,
  //         isPhoneExistsError: true,
  //       };
  //     }

  //     const existingProfileName = await this.userModel.findOne({
  //       profile_name: createHelperDto?.profile_name,
  //       role: { $in: [Role.Corporator, Role.Helper] },
  //     });
  //     if (existingProfileName) {
  //       return {
  //         status: eAPIResultStatus.Failure,
  //         isProfileNameExistError: true,
  //       };
  //     }

  //       createHelperDto.role = Role.Helper;
  //       createHelperDto.isVerified = true;
  //       console.log(createHelperDto);

  //       const newHelper: any = new this.userModel({
  //         ...createHelperDto,
  //         // add + in country code if not
  //         country_code:
  //           createHelperDto?.country_code &&
  //           !createHelperDto?.country_code.startsWith('+')
  //             ? '+' + createHelperDto?.country_code
  //             : createHelperDto?.country_code,
  //         corporate_id: createHelperDto?.corporator_id,
  //       });

  //       const helper = await newHelper.save();

  //       await this.geoLocationDetailsModel.create({
  //         user_id: '' + helper._id,
  //         location: [createHelperDto?.lat, createHelperDto.lng],
  //         role: Role.Helper,
  //       });

  //       helper.password = null;

  //       const payload = {
  //         email: helper.email,
  //         _id: helper._id,
  //         role: helper.role,
  //       };

  //       const access_token = this.jwtService.sign(payload);

  //       await this.tokenModel.create({ user_id: helper._id, access_token });
  //       const corporate = await this.userModel.findById(
  //         createHelperDto?.corporator_id,
  //       );

  //       return {
  //         status: eAPIResultStatus.Success,
  //         accessToken: access_token,
  //         user: helper,
  //         corporate,
  //       };

  //     return { status: eAPIResultStatus.Success };
  //   } catch (error) {
  //     throw new CustomValidationException(error.message);
  //   }
  // }

  //check phone no exists , occupied by corporate helper or never user
  async checkPhoneNoExists(
    dto: CheckPhoneNoRequestDTO,
  ): Promise<CheckPhoneNoResponseDTO> {
    try {
      const { phone_no, country_code } = dto;
      const existingHelper = await this.userModel.findOne({
        phone_no,
        country_code,
        role: { $in: [Role.Corporator, Role.Helper] },
      });

      if (existingHelper) {
        return { status: eAPIResultStatus.Failure, isPhoneNoExist: true };
      }

      const invitedHelper = await this.invitedHelperModel.findOne({
        $or: [
          {
            phone_no,
            country_code: country_code.split('+')[1],
          },
          {
            phone_no,
            country_code,
          },
        ],
      });

      if (invitedHelper) {
        return {
          status: eAPIResultStatus.Success,
          isPhoneNoExistForCorporateHelper: true,
          data: invitedHelper,
        };
      }

      return {
        status: eAPIResultStatus.Success,
        isPhoneNoValid: true,
      };
    } catch (error) {
      console.error('Error checking phone number:', error);
      return { status: eAPIResultStatus.Failure };
    }
  }

  // verify otp for login
  async verifyOtpForLogin(
    verifyPhoneNoOTPRequestDTO: VerifyPhoneNoOTPRequestDTO,
  ): Promise<UserSigninResponseDTO> {
    try {
      const { phone_no, country_code, otp } = verifyPhoneNoOTPRequestDTO;

      const helper = await this.userModel.findOne({
        phone_no,
        country_code,
        role: { $in: [Role.Helper, Role.Corporator] },
      });

      if (!helper) {
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
        role: '' + helper?.role,
      };
      const verifyOtpResponseData =
        await this.phoneNoHelperOtpService.verifyPhoneNoOTPForLogin(dto);

      if (verifyOtpResponseData?.status == eAPIResultStatus.Failure) {
        return verifyOtpResponseData;
      }

      const LoginAttemptsBody = {
        user_id: '' + helper._id,
        login_type: LoginType.Email,
      };
      const loginAttempt =
        await this.createLoginAttemptRecord(LoginAttemptsBody);

      if (!helper.isVerified) {
        await this.updateLoginStatus(
          '' + loginAttempt._id,
          LoginStatus.Success,
        );

        helper.last_login = new Date();
        await helper.save();

        return {
          incorrectCredentialsError: false,
          userExistsError: false,
          isVerified: false,
          status: eAPIResultStatus.Success,
          user_id: '' + helper?._id,
          role: '' + helper?.role,
          isCorporateHelper: helper?.corporate_id ? true : false,
        };
      }

      const payload = {
        email: helper?.email,
        _id: helper._id,
        role: helper.role,
      };

      const access_token = this.jwtService.sign(payload);

      await this.createTokenRecord('' + helper._id, access_token);
      await this.updateLoginStatus('' + loginAttempt._id, LoginStatus.Success);

      helper.last_login = new Date();
      await helper.save();

      return {
        status: eAPIResultStatus.Success,
        accessToken: access_token,
        isVerified: true,
        user_id: '' + helper._id,
        step: '' + helper?.step,
        points: helper?.points,
        role: '' + helper?.role,
        isCorporateHelper: helper?.corporate_id ? true : false,
      };
    } catch (error) {
      return {
        status: eAPIResultStatus.Failure,
      };
    }
  }
}

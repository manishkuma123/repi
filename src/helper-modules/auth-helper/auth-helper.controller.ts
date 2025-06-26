import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthHelperService } from './auth-helper.service';
import { UserSignupRequestDTO } from 'src/dtos/user-dto/request/signup.dto';
import { UserSignupResponseDTO } from 'src/dtos/user-dto/response/signup.dto';
import { UserSigninRequestDTO } from 'src/dtos/user-dto/request/signin.dto';
import { UpdatePasswordRequestDTO } from 'src/dtos/user-dto/request/update-password-request.dto';
import { HelperSignupRequestDTO } from 'src/dtos/user-dto/request/helper-signup.dto';
import { GoogleLoginDTO } from 'src/dtos/user-dto/request/google-login.dto';
import { GoogleLoginResponseDTO } from 'src/dtos/user-dto/response/google-login-response.dto';
import { AppleLoginDTO } from 'src/dtos/user-dto/request/apple-login-.dto';
import { AppleLoginResponseDTO } from 'src/dtos/user-dto/response/apple-login-response.dto';
import { UserSigninResponseDTO } from 'src/dtos/user-dto/response/signin.dto';
import { CreateHelperRequestDTO } from './dto/request/create-helper-dto';
import { CreateHelperResponseDTO } from './dto/response/create-helper.dto';
import { AuthGuard } from '../guards/AuthGuard';
import { CreateHelperDetailsRequestDTO } from './dto/request/create-helper-details.dto';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { CheckPhoneNoRequestDTO } from './dto/request/check-phone-no.dto';
import { VerifyPhoneNoOTPRequestDTO } from 'src/dtos/phone-no-otp/request/verify-otp';

@Controller('helper/auth')
export class AuthHelperController {
  constructor(private readonly authHelperService: AuthHelperService) {}

  // @Post('corporate-helper-signup')
  // async newCorporateHelperSignup(
  //   @Body() createHelperDto: HelperSignupRequestDTO,
  // ): Promise<UserSignupResponseDTO> {
  //   return this.authHelperService.newCorporateHelperSignup(createHelperDto);
  // }

  @Post('signup')
  async signup(
    @Body() createHelperDto: HelperSignupRequestDTO,
  ): Promise<UserSignupResponseDTO> {
    return this.authHelperService.signup(createHelperDto);
  }

  @Post('signin')
  async signin(
    @Body() loginHelperDto: UserSigninRequestDTO,
  ): Promise<UserSigninResponseDTO> {
    return this.authHelperService.login(loginHelperDto);
  }

  @Post('google-login')
  googleLogin(@Body() dto: GoogleLoginDTO): Promise<GoogleLoginResponseDTO> {
    return this.authHelperService.googleSignUp(dto);
  }

  @Post('apple-signin')
  appleLogin(@Body() dto: AppleLoginDTO): Promise<AppleLoginResponseDTO> {
    return this.authHelperService.appleAuthentication(dto);
  }

  @Post('change-password')
  async changePassword(
    @Body() updatePasswordRequestDTO: UpdatePasswordRequestDTO,
  ) {
    return this.authHelperService.changePassword(updatePasswordRequestDTO);
  }

  @Delete(':email')
  deleteUser(@Param('email') email: string) {
    return this.authHelperService.deleteUser(email);
  }

  @Post('/create')
  createHelper(
    @Body() createHelperDTO: CreateHelperRequestDTO,
  ): Promise<CreateHelperResponseDTO> {
    return this.authHelperService.createHelper(createHelperDTO);
  }

  @UseGuards(AuthGuard)
  @Post('/create-helper-details')
  createHelperDetails(
    @Body() createHelperDetailsDTO: CreateHelperDetailsRequestDTO,
    @Req() req: any,
  ): Promise<ResponseDTO> {
    return this.authHelperService.createHelperDetails(
      req?.user?._id,
      createHelperDetailsDTO,
    );
  }

  @Post('check-phone-no-exists')
  async checkPhoneNoExists(@Body() dto: CheckPhoneNoRequestDTO) {
    return this.authHelperService.checkPhoneNoExists(dto);
  }

  @Post('verify-phone-no-otp-for-login')
  async verifyPhoneNoOTPForLogin(
    @Body() dto: VerifyPhoneNoOTPRequestDTO,
  ): Promise<UserSigninResponseDTO> {
    return this.authHelperService.verifyOtpForLogin(dto);
  }
}

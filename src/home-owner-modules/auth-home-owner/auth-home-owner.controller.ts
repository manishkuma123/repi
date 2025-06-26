import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthHomeOwnerService } from './auth-home-owner.service';
import { CreateHomeOwnerDTO } from './dto/request/create-home-owner.dto';
import { LoginHomeOwnerDto } from './dto/request/login-home-owner.dto';
import { LoginHomeOwnerResponseDTO } from './dto/response/login-response.dto';
import { CreateHomeOwnerResponseDTO } from './dto/response/create-home-owner-response.dto';
import { UpdatePasswordRequestDTO } from '../../dtos/user-dto/request/update-password-request.dto';
import { UpdatePasswordResponseDTO } from '../../dtos/user-dto/response/update-password-response.dto';
import { GoogleLoginDTO } from '../../dtos/user-dto/request/google-login.dto';
import { GoogleLoginResponseDTO } from '../../dtos/user-dto/response/google-login-response.dto';
import { AppleLoginDTO } from '../../dtos/user-dto/request/apple-login-.dto';
import { AppleLoginResponseDTO } from '../../dtos/user-dto/response/apple-login-response.dto';
import { UserSignupRequestDTO } from 'src/dtos/user-dto/request/signup.dto';
import { UserSignupResponseDTO } from 'src/dtos/user-dto/response/signup.dto';
import { UserSigninRequestDTO } from 'src/dtos/user-dto/request/signin.dto';
import { AuthGuard } from 'src/helper-modules/guards/AuthGuard';
import { UpdateHomeOwnerDTO } from './dto/request/update-home-owner.dto';
import { UpdateHomeOwnerResponseDTO } from './dto/response/update-home-owner.dto';
import { ChangePasswordDTO } from './dto/request/change-password.dto';
import { ChangePasswordResponseDTO } from './dto/response/change-password.dto';
import { VerifyPhoneNoOTPRequestDTO } from 'src/dtos/phone-no-otp/request/verify-otp';
import { UserSigninResponseDTO } from 'src/dtos/user-dto/response/signin.dto';

@Controller('home-owner/auth')
export class AuthHomeOwnerController {
  constructor(private readonly authHomeOwnerService: AuthHomeOwnerService) {}

  @Post('signup')
  async signup(
    @Body() userSignupRequestDTO: UserSignupRequestDTO,
  ): Promise<UserSignupResponseDTO> {
    const response =
      await this.authHomeOwnerService.signup(userSignupRequestDTO);
    return response;
  }

  @Post('send-otp-for-login')
  async sendOtpForlogin(
    @Body() loginHomeOwnerDto: UserSigninRequestDTO,
  ): Promise<UserSignupResponseDTO> {
    const response =
      await this.authHomeOwnerService.sendOtpForlogin(loginHomeOwnerDto);
    return response;
  }

  @Post('verify-phone-no-otp-for-login')
  async verifyPhoneNoOTPForLogin(
    @Body() dto: VerifyPhoneNoOTPRequestDTO,
  ): Promise<UserSigninResponseDTO> {
    return this.authHomeOwnerService.verifyOtpForLogin(dto);
  }

  @Post('change-password')
  async changePassword(
    @Body() loginHomeOwnerDto: UpdatePasswordRequestDTO,
  ): Promise<UpdatePasswordResponseDTO> {
    const response =
      await this.authHomeOwnerService.changePassword(loginHomeOwnerDto);
    return response;
  }

  @Post('google-login')
  googleLogin(@Body() dto: GoogleLoginDTO): Promise<GoogleLoginResponseDTO> {
    return this.authHomeOwnerService.googleSignUp(dto);
  }

  @Post('apple-signin')
  appleLogin(@Body() dto: AppleLoginDTO): Promise<AppleLoginResponseDTO> {
    return this.authHomeOwnerService.appleAuthentication(dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  getUser(@Req() req: any) {
    return this.authHomeOwnerService.getHomeOwner('' + req?.user?._id);
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.authHomeOwnerService.getHomeOwner(id);
  }

  @Delete(':id')
  deleteHomeOwner(@Param('id') id: string) {
    return this.authHomeOwnerService.deleteHomeOwner(id);
  }

  @UseGuards(AuthGuard)
  @Patch()
  updateHomeOwner(
    @Body() updateHomeOwnerDto: UpdateHomeOwnerDTO,
    @Req() req: any,
  ): Promise<UpdateHomeOwnerResponseDTO> {
    return this.authHomeOwnerService.updateHomeOwner(
      '' + req?.user?._id,
      updateHomeOwnerDto,
    );
  }




  @UseGuards(AuthGuard)
  @Patch('change-password-when-logged-in')
  changePasswordWhenLogin(
    @Body() changePasswordDto: ChangePasswordDTO,
    @Req() req: any,
  ): Promise<ChangePasswordResponseDTO> {
    return this.authHomeOwnerService.changePasswordWhenLogin(
      req?.user?._id,
      changePasswordDto,
    );
  }
}

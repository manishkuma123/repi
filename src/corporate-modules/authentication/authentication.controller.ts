import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UserSigninRequestDTO } from 'src/dtos/user-dto/request/signin.dto';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { VerifyPhoneNoOTPRequestDTO } from 'src/dtos/phone-no-otp/request/verify-otp';

@Controller('corporator/auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('send-otp-for-login')
  async login(
    @Body() userSigninRequestDTO: UserSigninRequestDTO,
  ): Promise<ResponseDTO> {
    return this.authService.login(userSigninRequestDTO);
  }

  @Post('verify-otp-for-login')
  async verifyOtp(
    @Body() verifyPhoneNoOTPRequestDTO: VerifyPhoneNoOTPRequestDTO,
  ): Promise<ResponseDTO> {
    return this.authService.verifyPhoneNoOTPForLogin(
      
      verifyPhoneNoOTPRequestDTO,
    );
  }

  @Post('send-email')
  async sendEmail(@Body('email') email: string) {
    return this.authService.sendEmailToCorporator(email);
  }
}

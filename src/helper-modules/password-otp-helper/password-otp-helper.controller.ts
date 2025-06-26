import { Controller, Post, Body } from '@nestjs/common';
import { PasswordOtpHelperService } from './password-otp-helper.service';
import { SendOtpRequestDTO } from 'src/dtos/otp-dto/request/send-otp-request.dto';
import { SendOTPResponseDTO } from 'src/dtos/otp-dto/response/send-otp-response.dto';
import { VerifyOTPRequestDTO } from 'src/dtos/otp-dto/request/verify-otp-request.dto';

@Controller('helper/password-otp')
export class PasswordOtpHelperController {
  constructor(private readonly otpService: PasswordOtpHelperService) {}

  @Post('send')
  async createOtp(
    @Body() createOtpDto: SendOtpRequestDTO,
  ): Promise<SendOTPResponseDTO> {
    return this.otpService.createOtp(createOtpDto);
  }

  @Post('validate')
  async validateOtp(@Body() verifyOTPRequestDTO: VerifyOTPRequestDTO) {
    return this.otpService.validateOtp(verifyOTPRequestDTO);
  }
}

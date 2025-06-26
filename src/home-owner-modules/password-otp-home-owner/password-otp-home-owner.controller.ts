import { Controller, Post, Body } from '@nestjs/common';
import { PasswordOtpHomeOwnerService } from './password-otp-home-owner.service';
import { SendOtpRequestDTO } from 'src/dtos/otp-dto/request/send-otp-request.dto';
import { SendOTPResponseDTO } from 'src/dtos/otp-dto/response/send-otp-response.dto';
import { VerifyOTPRequestDTO } from 'src/dtos/otp-dto/request/verify-otp-request.dto';
import { VerifyOTPResponseDTO } from 'src/dtos/otp-dto/response/verify-otp-response.dto';

@Controller('home-owner/password-otp')
export class PasswordOtpHomeOwnerController {
  constructor(private readonly otpService: PasswordOtpHomeOwnerService) {}

  @Post('send')
  async createOtp(
    @Body() createOtpDto: SendOtpRequestDTO,
  ): Promise<SendOTPResponseDTO> {
    return this.otpService.createOtp(createOtpDto);
  }

  @Post('validate')
  async validateOtp(
    @Body() req: VerifyOTPRequestDTO,
  ): Promise<VerifyOTPResponseDTO> {
    return this.otpService.validateOtp(req);
  }
}

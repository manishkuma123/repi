import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OtpHomeOwnerService } from './otp-home-owner.service';
import { SendOtpRequestDTO } from 'src/dtos/otp-dto/request/send-otp-request.dto';
import { SendOTPResponseDTO } from 'src/dtos/otp-dto/response/send-otp-response.dto';
import { VerifyOTPRequestDTO } from 'src/dtos/otp-dto/request/verify-otp-request.dto';
import { VerifyOTPResponseDTO } from 'src/dtos/otp-dto/response/verify-otp-response.dto';

@Controller('home-owner/otp')
export class OtpHomeOwnerController {
  constructor(private readonly otpService: OtpHomeOwnerService) {}

  @Post('send')
  async generateOtp(
    @Body() sendOTPDTO: SendOtpRequestDTO,
  ): Promise<SendOTPResponseDTO> {
    const response = await this.otpService.sendOTP(sendOTPDTO);
    return response;
  }

  @Post('validate')
  async validateOtp(
    @Body() verifyOTPDTO: VerifyOTPRequestDTO,
  ): Promise<VerifyOTPResponseDTO> {
    const response = await this.otpService.validateOtp(verifyOTPDTO);
    return response;
  }
}

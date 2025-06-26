import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OtpHelperService } from './otp-helper.service';
import { SendOtpRequestDTO } from 'src/dtos/otp-dto/request/send-otp-request.dto';
import { SendOTPResponseDTO } from 'src/dtos/otp-dto/response/send-otp-response.dto';
import { VerifyOTPRequestDTO } from 'src/dtos/otp-dto/request/verify-otp-request.dto';
import { VerifyOTPResponseDTO } from 'src/dtos/otp-dto/response/verify-otp-response.dto';

@Controller('helper/otp')
export class OtpHelperController {
  constructor(private readonly otpHelperService: OtpHelperService) {}

  @Post('send')
  async generateOtp(
    @Body() createOtpDto: SendOtpRequestDTO,
  ): Promise<SendOTPResponseDTO> {
    return this.otpHelperService.createOtp(createOtpDto);
  }

  @Post('validate')
  async validateOtp(
    @Body() verifyOTPRequestDTO: VerifyOTPRequestDTO,
  ): Promise<VerifyOTPResponseDTO> {
    return await this.otpHelperService.validateOtp(verifyOTPRequestDTO);
  }
}

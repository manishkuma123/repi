import { Body, Controller, Post } from '@nestjs/common';
import { PhoneNoOtpHomeOwnerService } from './phone-no-otp-home-owner.service';
import { SendPhoneNoOTPRequestDTO } from 'src/dtos/phone-no-otp/request/send-otp';
import { SendPhoneNoOTPResponseDTO } from 'src/dtos/phone-no-otp/response/send-otp';
import { VerifyPhoneNoOTPRequestDTO } from 'src/dtos/phone-no-otp/request/verify-otp';
import { VerifyPhoneNoOTPResponseDTO } from 'src/dtos/phone-no-otp/response/verify-otp';

@Controller('home-owner/phone-no-otp')
export class PhoneNoOtpHomeOwnerController {
  constructor(
    private readonly phoneNoOtpHomeOwnerService: PhoneNoOtpHomeOwnerService,
  ) {}

  @Post('send')
  async generateOtp(
    @Body() createOtpDto: SendPhoneNoOTPRequestDTO,
  ): Promise<SendPhoneNoOTPResponseDTO> {
    return this.phoneNoOtpHomeOwnerService.createOtp(createOtpDto);
  }

  @Post('validate')
  async validateOtp(
    @Body() verifyOTPRequestDTO: VerifyPhoneNoOTPRequestDTO,
  ): Promise<VerifyPhoneNoOTPResponseDTO> {
    return await this.phoneNoOtpHomeOwnerService.validateOtp(
      verifyOTPRequestDTO,
    );
  }
}

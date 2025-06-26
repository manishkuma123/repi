import { Body, Controller, Post } from '@nestjs/common';
import { PhoneNoOtpHelperService } from './phone-no-otp-helper.service';
import { SendPhoneNoOTPRequestDTO } from 'src/dtos/phone-no-otp/request/send-otp';
import { SendPhoneNoOTPResponseDTO } from 'src/dtos/phone-no-otp/response/send-otp';
import { VerifyPhoneNoOTPRequestDTO } from 'src/dtos/phone-no-otp/request/verify-otp';
import { VerifyPhoneNoOTPResponseDTO } from 'src/dtos/phone-no-otp/response/verify-otp';

@Controller('helper/phone-no-otp')
export class PhoneNoOtpHelperController {
  constructor(
    private readonly phoneNoOtpHelperService: PhoneNoOtpHelperService,
  ) {}

  @Post('send')
  async generateOtp(
    @Body() createOtpDto: SendPhoneNoOTPRequestDTO,
  ): Promise<SendPhoneNoOTPResponseDTO> {
    return this.phoneNoOtpHelperService.createOtp(createOtpDto);
  }

  // @Post('corporate-helper-validate')
  // async validateOTPForCoporateHelper(
  //   @Body() verifyOTPRequestDTO: VerifyPhoneNoOTPRequestDTO,
  // ): Promise<VerifyPhoneNoOTPResponseDTO> {
  //   return await this.phoneNoOtpHelperService.validateOTPForCoporateHelper(
  //     verifyOTPRequestDTO,
  //   );
  // }

  @Post('validate')
  async validateOtp(
    @Body() verifyOTPRequestDTO: VerifyPhoneNoOTPRequestDTO,
  ): Promise<VerifyPhoneNoOTPResponseDTO> {
    return await this.phoneNoOtpHelperService.validateOtp(verifyOTPRequestDTO);
  }
}

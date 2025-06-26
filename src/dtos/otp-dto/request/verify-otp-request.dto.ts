import { HelperSignupRequestDTO } from 'src/dtos/user-dto/request/helper-signup.dto';

export interface VerifyOTPRequestDTO extends HelperSignupRequestDTO {
  OTP: string;
}

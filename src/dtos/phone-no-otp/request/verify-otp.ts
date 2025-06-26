import { UserSignupRequestDTO } from 'src/dtos/user-dto/request/signup.dto';

export interface VerifyPhoneNoOTPRequestDTO extends UserSignupRequestDTO {
  otp: string;
}

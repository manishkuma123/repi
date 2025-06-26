import { User } from 'src/entitites/user';
import { eAPIResultStatus } from 'src/utils/enum';

export interface VerifyPhoneNoOTPResponseDTO {
  status?: eAPIResultStatus;
  otpRequired?: boolean;
  invalidPhoneNoError?: boolean;
  invalidOTPError?: boolean;
  isPhoneExistsError?: boolean;
  otpExpiredError?: boolean;
  profileNameExistsError?: boolean;
  accessToken?: string;
  corporate?: any;
  user?: User;
}

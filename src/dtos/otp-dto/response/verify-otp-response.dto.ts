import { User } from 'src/entitites/user';
import { eAPIResultStatus } from 'src/utils/enum';

export interface VerifyOTPResponseDTO {
  status?: eAPIResultStatus;
  otpRequired?: boolean;
  invalidEmailError?: boolean;
  invalidOTPError?: boolean;
  isEmailExistsError?: boolean;
  isAliasNameExistError?: boolean;
  otpExpiredError?: boolean;
  accessToken?: string;
  User?: User;
}

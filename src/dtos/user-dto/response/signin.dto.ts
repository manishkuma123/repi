import { User } from 'src/entitites/user';
import { eAPIResultStatus } from 'src/utils/enum';

export interface UserSigninResponseDTO {
  status?: eAPIResultStatus;
  userExistsError?: boolean;
  incorrectCredentialsError?: boolean;
  isVerified?: boolean;
  accessToken?: string;
  user_id?: string;
  step?: string;
  points?: number;
  role?: string;
  isCorporateHelper?: boolean;
  isNewCorporateHelper?: boolean;
  corporateHelper?: any;
  invalidPhoneNoError?: boolean;
  data?: any;
}

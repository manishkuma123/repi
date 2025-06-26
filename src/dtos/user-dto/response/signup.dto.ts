import { User } from 'src/entitites/user';
import { eAPIResultStatus } from 'src/utils/enum';

export interface UserSignupResponseDTO {
  status?: eAPIResultStatus;
  isPhoneNoExistError?: boolean;
  isEmailExistError?: boolean;
  isProfileNameExistError?: boolean;
  isAliasNameExistError?: boolean;
  data?: any;
}

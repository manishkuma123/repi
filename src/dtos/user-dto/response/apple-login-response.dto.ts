import { eAPIResultStatus } from 'src/utils/enum';

export interface AppleLoginResponseDTO {
  status?: eAPIResultStatus;
  isNewUser?: boolean;
  isVerified?: boolean;
  accessToken?: string;
  user_id?: string;
}

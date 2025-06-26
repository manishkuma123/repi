import { eAPIResultStatus } from 'src/utils/enum';

export interface GoogleLoginResponseDTO {
  status?: eAPIResultStatus;
  isNewUser?: boolean;
  isVerified?: boolean;
  accessToken?: string;
  profileNameExists?: boolean;
  user_id?: string;
}

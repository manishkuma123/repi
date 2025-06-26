import { User } from 'src/entitites/user';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateHelperResponseDTO {
  status?: eAPIResultStatus;
  isVerified?: boolean;
  accessToken?: string;
  user?: User;
}

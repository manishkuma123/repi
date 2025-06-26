import { User } from 'src/entitites/user';
import { eAPIResultStatus } from 'src/utils/enum';

export interface getAllHomeOwnersResponseDTO {
  status: eAPIResultStatus;
  data?: any[] | User;
}

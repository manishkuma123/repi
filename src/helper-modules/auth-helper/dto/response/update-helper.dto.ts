import { User } from 'src/entitites/user';
import { eAPIResultStatus } from 'src/utils/enum';

export interface UpdateHelperResponseDTO {
  status?: eAPIResultStatus;
  invalidHelper?: boolean;
  profileNameExistsError?: boolean;
  data?: User;
}

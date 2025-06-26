import { User } from 'src/entitites/user';
import { eAPIResultStatus } from 'src/utils/enum';

export interface GetHelperByNameResponseDTO {
  status?: eAPIResultStatus;
  data?: any[];
  message?: string;
}

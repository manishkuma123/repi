import { eAPIResultStatus } from 'src/utils/enum';

export interface ChangePasswordResponseDTO {
  status?: eAPIResultStatus;
  invalidHomeOwnerId?: boolean;
  invalidOldPassword?: boolean;
  confirmPasswordNotMatch?: boolean;
}

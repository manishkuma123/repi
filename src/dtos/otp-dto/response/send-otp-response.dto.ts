import { eAPIResultStatus } from 'src/utils/enum';

export interface SendOTPResponseDTO {
  status?: eAPIResultStatus;
  invalidEmailError?: boolean;
  isEmailExistError?: boolean;
}

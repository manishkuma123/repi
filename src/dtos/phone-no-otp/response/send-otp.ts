import { eAPIResultStatus } from 'src/utils/enum';

export interface SendPhoneNoOTPResponseDTO {
  status?: eAPIResultStatus;
  invalidPhoneError?: boolean;
  isPhoneNoExistError?: boolean;
  data?: any;
}

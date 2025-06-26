import { eAPIResultStatus } from 'src/utils/enum';

export interface VerifyPaymentResponseDTO {
  status?: eAPIResultStatus;
  message?: any | any[];
  data?: any | any[];
}

import { eAPIResultStatus } from 'src/utils/enum';

export interface ResponseDTO {
  status?: eAPIResultStatus;
  data?: any | any[];
  message?: string;
}

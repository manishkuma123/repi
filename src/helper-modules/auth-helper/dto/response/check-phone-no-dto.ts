import { eAPIResultStatus } from 'src/utils/enum';

export class CheckPhoneNoResponseDTO {
  status: eAPIResultStatus;
  isPhoneNoExist?: boolean;
  isPhoneNoExistForCorporateHelper?: boolean;
  isPhoneNoValid?: boolean;
  data?: any;
}

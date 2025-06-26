import { HelperBankDetails } from 'src/entitites/helper-bank-details.entity';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateBankDetailsResponseDTO {
  status: eAPIResultStatus;
  data?: HelperBankDetails;
}

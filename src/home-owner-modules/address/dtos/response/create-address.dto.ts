import { HomeOwnerAddress } from 'src/entitites/home-owner-address';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateHomeOwnerAddressResponseDTO {
  status: eAPIResultStatus;
  data?: HomeOwnerAddress;
  InValidCustomerId?: boolean;
}

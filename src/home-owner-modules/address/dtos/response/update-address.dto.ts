import { HomeOwnerAddress } from 'src/entitites/home-owner-address';
import { eAPIResultStatus } from 'src/utils/enum';

export interface UpdateHomeOwnerAddressResponseDTO {
  status: eAPIResultStatus;
  data?: HomeOwnerAddress;
  invalidAddressId?: boolean;
}

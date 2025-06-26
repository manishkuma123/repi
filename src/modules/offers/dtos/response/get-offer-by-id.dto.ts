import { HelperOffer } from 'src/entitites/helper-offer';
import { eAPIResultStatus } from 'src/utils/enum';

export interface GetHelperOfferResponseDTO {
  status: eAPIResultStatus;
  InvalidOfferId?: boolean;
  InvalidCustomer?: boolean;
  data?: any;
}

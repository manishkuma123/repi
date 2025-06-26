import { HelperOffer } from 'src/entitites/helper-offer';
import { eAPIResultStatus } from 'src/utils/enum';

export interface UpdateHelperOfferResponseDTO {
  status: eAPIResultStatus;
  InvalidOfferId?: boolean;
  InvalidHelper?: boolean;
  data?: HelperOffer;
}

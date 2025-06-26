import { HelperOffer } from 'src/entitites/helper-offer';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateHelperOfferResponseDTO {
  status: eAPIResultStatus;
  InvalidHelperId?: boolean;
  InvalidJobId?: boolean;
  data?: HelperOffer;
}

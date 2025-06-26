import { HelperEvent } from 'src/entitites/helper-event';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateHelperEventResponseDTO {
  status: eAPIResultStatus;
  invalidHelperId?: boolean;
  data?: HelperEvent;
}

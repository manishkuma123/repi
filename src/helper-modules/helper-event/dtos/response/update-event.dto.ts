import { HelperEvent } from 'src/entitites/helper-event';
import { eAPIResultStatus } from 'src/utils/enum';

export interface UpdateHelperEventResponseDTO {
  status: eAPIResultStatus;
  invalidEventId?: boolean;
  data?: HelperEvent;
}

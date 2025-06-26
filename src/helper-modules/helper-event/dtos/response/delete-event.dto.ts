import { HelperEvent } from 'src/entitites/helper-event';
import { eAPIResultStatus } from 'src/utils/enum';

export interface DeleteHelperEventResponseDTO {
  status: eAPIResultStatus;
  invalidEventId?: boolean;
}

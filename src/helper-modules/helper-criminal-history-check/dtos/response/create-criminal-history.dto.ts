import { HelperCriminalHistoryCheck } from 'src/entitites/helper-criminal-history-check';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateCriminalHistoryResponseDTO {
  status: eAPIResultStatus;
  data?: HelperCriminalHistoryCheck;
}

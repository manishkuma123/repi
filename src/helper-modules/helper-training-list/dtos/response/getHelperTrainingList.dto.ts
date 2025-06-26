import { HelperTrainingList } from 'src/entitites/helper-training-list';
import { eAPIResultStatus } from 'src/utils/enum';

export interface GetHelperTraningListResponseDTO {
  status: eAPIResultStatus;
  data?: HelperTrainingList[];
  inValidHelper?: boolean;
}

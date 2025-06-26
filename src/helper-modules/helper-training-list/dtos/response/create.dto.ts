import { HelperTrainingList } from 'src/entitites/helper-training-list';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateHelperTrainingListResponsetDTO {
  status: eAPIResultStatus;
  validationError?: boolean;
  data?: HelperTrainingList;
}

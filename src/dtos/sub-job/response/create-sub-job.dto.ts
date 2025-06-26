import { SubJob } from 'src/entitites/sub-job';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateSubJobResponseDTO {
  status?: eAPIResultStatus;
  data?: SubJob;
}

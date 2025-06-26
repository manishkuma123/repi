import { SubJob } from 'src/entitites/sub-job';
import { eAPIResultStatus } from 'src/utils/enum';

export interface GetByMainJobIdResponseDTO {
  status?: eAPIResultStatus;
  data?: SubJob[];
}

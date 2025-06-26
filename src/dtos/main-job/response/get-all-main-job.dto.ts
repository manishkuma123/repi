import { MainJob } from 'src/entitites/main-job';
import { eAPIResultStatus } from 'src/utils/enum';

export interface GetAllMainJobResponseDTO {
  status?: eAPIResultStatus;
  data?: MainJob[] | any[];
}

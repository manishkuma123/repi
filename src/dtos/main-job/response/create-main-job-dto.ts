import { MainJob } from 'src/entitites/main-job';
import { User } from 'src/entitites/user';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateMainJobResponseDTO {
  status: eAPIResultStatus;
  data?: MainJob;
}

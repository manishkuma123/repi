import { Session } from 'src/utils/Types/interfaces';

export interface CreateHelperTrainingListRequestDTO {
  main_job_id: number;
  sub_job_id: number;
  sessions: Session[];
}

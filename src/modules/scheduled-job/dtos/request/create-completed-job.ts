import { JobProgress } from 'src/utils/enum';

export class CreateCompletedJobDTO {
  media?: string[];
  completed_date?: Date;
  completed_time_stamp?: bigint;
  description?: string;
  status?: JobProgress;
}

import { eAPIResultStatus } from 'src/utils/enum';

export class CreateScheduledJobResponseDTO {
  status: eAPIResultStatus;
  jobIsAlreadyScheduled?: boolean;
  data?: any;
}

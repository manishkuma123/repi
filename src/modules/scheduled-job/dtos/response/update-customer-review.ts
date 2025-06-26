import { eAPIResultStatus } from 'src/utils/enum';

export class UpdateCustomerRatingResponseDTO {
  status: eAPIResultStatus;
  invalidScheduleJobId?: boolean;
  data?: any;
}

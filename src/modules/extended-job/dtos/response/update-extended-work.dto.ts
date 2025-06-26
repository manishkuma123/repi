import { eAPIResultStatus } from 'src/utils/enum';

export interface UpdateExtendedJobResponseDTO {
  status: eAPIResultStatus;
  invalidExtendedJobId?: boolean;
  data?: any;
}

import { eAPIResultStatus } from 'src/utils/enum';

export class CreateCancelJobResponseDTO {
  status: eAPIResultStatus;
  invalidJob?: boolean;
}

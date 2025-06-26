import { HelperEvent } from 'src/entitites/helper-event';
import { eAPIResultStatus } from 'src/utils/enum';

export interface GetAllHelperEventResponseDTO {
  status: eAPIResultStatus;
  invalidMonth?: boolean;
  events?: HelperEvent[];
  toDoJobs?: any[];
}

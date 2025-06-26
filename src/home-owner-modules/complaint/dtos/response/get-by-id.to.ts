import { Complaint } from 'src/entitites/complaints';
import { eAPIResultStatus } from 'src/utils/enum';

export interface GetComplaintByIdResponseDTO {
  status: eAPIResultStatus;
  invalidId?: boolean;
  data?: Complaint;
}

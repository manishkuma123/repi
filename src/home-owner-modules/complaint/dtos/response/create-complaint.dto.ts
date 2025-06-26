import { Complaint } from 'src/entitites/complaints';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateComplaintResponseDTO {
  status: eAPIResultStatus;
  invalidOrderNumber?: boolean;
  data?: Complaint;
}

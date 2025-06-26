import { Complaint } from 'src/entitites/complaints';
import { eAPIResultStatus } from 'src/utils/enum';

export interface GetAllComplaintsResponseDTO {
  status: eAPIResultStatus;
  data?: Complaint[];
}

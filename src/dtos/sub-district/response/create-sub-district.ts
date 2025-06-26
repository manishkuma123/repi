import { SubDistrict } from 'src/entitites/sub-district';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateSubDistrictResponseDTO {
  status: eAPIResultStatus;
  InvalidDistrictId?: boolean;
  data?: SubDistrict;
}

import { District } from 'src/entitites/districts';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateDistrictResponseDTO {
  status: eAPIResultStatus;
  InvalidProvinceId?: boolean;
  data?: District;
}

import { Province } from 'src/entitites/provinces';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateProviceResponseDTO {
  status: eAPIResultStatus;
  data?: Province;
}

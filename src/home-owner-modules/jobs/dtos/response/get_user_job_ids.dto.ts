import { eAPIResultStatus } from 'src/utils/enum';

export interface getUserJobIdsResponseDTO {
  status?: eAPIResultStatus;
  data?: string[];
}

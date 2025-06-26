import { eAPIResultStatus } from 'src/utils/enum';
import { SiteCheckListHelper } from '../../entities/site-check-list-helper.entity';

export interface GetAllSiteCheckListByMainAndSubJobIdResponseDTO {
  status?: eAPIResultStatus;
  data?: SiteCheckListHelper[];
  message?: string;
}

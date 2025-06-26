import { ForeignPassportHelper } from 'src/entitites/foreign-passport-helper.entity';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateForeignPassportHelperResponseDTO {
  status?: eAPIResultStatus;
  data?: ForeignPassportHelper;
  IssueDateError?: boolean;
  WorkPermitIssueData?: boolean;
}

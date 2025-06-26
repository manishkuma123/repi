import { eAPIResultStatus } from 'src/utils/enum';

export interface UpdateSkillHelperResponseDTO {
  status: eAPIResultStatus;
  invalidSkillId?: boolean;
}

import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateSkillsHelperResponseDTO {
  status?: eAPIResultStatus;
  UserIdError?: boolean;
  invalidHelper?: boolean;
}

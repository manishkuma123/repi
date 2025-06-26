import { IdentityCardHelper } from 'src/entitites/identity-card-helper.entity';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateIdentityCardHelperResponseDTO {
  status?: eAPIResultStatus;
  data?: IdentityCardHelper;
  IssueDateError?: boolean;
}

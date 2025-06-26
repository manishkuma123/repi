import { eAPIResultStatus } from 'src/utils/enum';

export interface UpdateHomeOwnerResponseDTO {
  status?: eAPIResultStatus;
  invalidHomeOwnerId?: boolean;
  aliasNameExistError?: boolean;
}

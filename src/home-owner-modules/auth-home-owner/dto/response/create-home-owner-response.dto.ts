import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateHomeOwnerResponseDTO {
    status?: eAPIResultStatus;
    emailExistsError?: boolean;
}

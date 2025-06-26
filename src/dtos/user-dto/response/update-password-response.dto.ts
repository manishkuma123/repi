import { eAPIResultStatus } from 'src/utils/enum';

export interface UpdatePasswordResponseDTO {
    status?: eAPIResultStatus;
    incorrectCredentialsError?: boolean;
    isVerified?: boolean;
}

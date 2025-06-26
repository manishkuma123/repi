import { eAPIResultStatus } from 'src/utils/enum';

export interface LoginHomeOwnerResponseDTO {
    status?: eAPIResultStatus;
    userExistsError?: boolean;
    incorrectCredentialsError?: boolean;
    isVerified?: boolean;
    accessToken?: string;
}

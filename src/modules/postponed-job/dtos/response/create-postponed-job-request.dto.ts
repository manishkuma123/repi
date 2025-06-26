import { eAPIResultStatus } from 'src/utils/enum';

export interface CreatePostponedJobRequestResponseDTO {
  status: eAPIResultStatus;
  invalidJobId?: boolean;
  limitReached?: boolean;
}

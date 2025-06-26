import { eAPIResultStatus } from 'src/utils/enum';
import { PostponedJob } from 'src/entitites/postponed-job';

export interface GetPostponedJobDetailsResponseDTO {
  status: eAPIResultStatus;
  invalidPostponedJobId?: boolean;
  data?: {
    postponedJob: PostponedJob;
    orderNumber: string;
    NoOfLimitLeft: number;
  };
}

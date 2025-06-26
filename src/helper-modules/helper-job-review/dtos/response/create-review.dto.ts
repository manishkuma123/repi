import { HelperJobReview } from 'src/entitites/helper-job-review';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateHelperJobReviewResponseDTO {
  status: eAPIResultStatus;
  invalidScheduledJobId?: boolean;
  data?: HelperJobReview;
}

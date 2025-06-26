import { eAPIResultStatus } from 'src/utils/enum';

export interface SubmitExamAnswersResponseDTO {
  status: eAPIResultStatus;
  inValidHelper?: boolean;
  isPassed?: boolean;
}

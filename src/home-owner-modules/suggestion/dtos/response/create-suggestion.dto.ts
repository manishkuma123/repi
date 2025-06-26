import { Complaint } from 'src/entitites/complaints';
import { Suggestion } from 'src/entitites/suggestion';
import { eAPIResultStatus } from 'src/utils/enum';

export interface CreateSuggestionResponseDTO {
  status: eAPIResultStatus;
  invalidOrderNumber?: boolean;
  data?: Suggestion;
}

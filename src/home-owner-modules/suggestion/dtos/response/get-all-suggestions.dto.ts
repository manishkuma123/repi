import { Complaint } from 'src/entitites/complaints';
import { Suggestion } from 'src/entitites/suggestion';
import { eAPIResultStatus } from 'src/utils/enum';

export interface GetAllSuggestionResponseDTO {
  status: eAPIResultStatus;
  data?: Suggestion[];
}

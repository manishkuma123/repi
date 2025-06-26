import { Suggestion } from 'src/entitites/suggestion';
import { eAPIResultStatus } from 'src/utils/enum';

export interface GetSuggestionByIdResponseDTO {
  status: eAPIResultStatus;
  invalidId?: boolean;
  data?: Suggestion;
}

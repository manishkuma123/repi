import { eAPIResultStatus } from 'src/utils/enum';

export class createCorporateBussinessDocumentResponseDTO {
  status: eAPIResultStatus;
  invalidCorporateId?: boolean;
}

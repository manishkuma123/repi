import { eGender } from 'src/helper-modules/types/enums';

export class CreateForeignPassportHelperDTO {
  helper_id: string;

  en_name: string;

  en_surname: string;

  employer_name: string;

  expiry_date: Date;

  work_permit_front_url: string;

  work_permit_back_url: string;

  work_permit_no: string;

  nationality: string;
}

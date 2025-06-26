import { JobName } from 'src/utils/Types/interfaces';

export interface CreateSubDistrictRequestDTO {
  name: JobName;
  district_id: string;
  zip: number;
}

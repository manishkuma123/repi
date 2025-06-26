import { DistrictName } from 'src/utils/Types/interfaces';

export interface CreateDistrictRequestDTO {
  name: DistrictName;
  province_id: string;
}

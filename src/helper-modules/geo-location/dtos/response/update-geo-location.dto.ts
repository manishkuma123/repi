import { GeoLocationDetails } from 'src/entitites/geo-location';
import { eAPIResultStatus } from 'src/utils/enum';

export interface UpdateHelperGeoLocationResponseDTO {
  status: eAPIResultStatus;
  data?: GeoLocationDetails;
  invalidGeolocationId?: boolean;
}

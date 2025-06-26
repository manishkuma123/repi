import { GeoLocationDetails } from 'src/entitites/geo-location';
import { eAPIResultStatus } from 'src/utils/enum';

export interface GetHelpersNearByLocationResponseDTO {
  status?: eAPIResultStatus;
  NotFoundHelpersWithInDistance?: boolean;
  data?: GeoLocationDetails[];
}

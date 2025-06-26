import { UpdateGeoLocationDetailsDTO } from 'src/helper-modules/geo-location/dtos/request/update-geo-location.dto';
import { Role } from 'src/utils/enum';
import { EmergencyContact } from 'src/utils/Types/interfaces';

export interface UpdateHelperRequestDTO {
  password?: string;
  phone_no?: string;
  apple_id?: string;
  google_id?: string;
  full_name?: string;
  profile_name?: string;
  role?: Role;
  isVerified?: boolean;
  profile_url?: string;
  country_code?: string;
  address?: string;
  address2?: string;
  province?: string;
  district?: string;
  sub_district?: string;
  zip?: string;
  referral_code?: string;
  emergency_contact?: EmergencyContact;
  push_notification_enabled?: boolean;
  engage_with_customers?: string;
  job_profile_images?: string[];
  location_details?: UpdateGeoLocationDetailsDTO;
}

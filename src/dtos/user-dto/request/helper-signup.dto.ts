import { EmergencyContact } from 'src/utils/Types/interfaces';
import { UserSignupRequestDTO } from './signup.dto';

export interface HelperSignupRequestDTO extends UserSignupRequestDTO {
  country_code: string;
  address: string;
  address2?: string;
  trader_name?: string;
  alias_name?: string;
  province: string;
  district: string;
  sub_district: string;
  zip: string;
  location?: [number, number];
  referral_code?: string;
  emergency_contact?: EmergencyContact;
  corporator_id?: string;
  lat?: number;
  lng?: number;
}

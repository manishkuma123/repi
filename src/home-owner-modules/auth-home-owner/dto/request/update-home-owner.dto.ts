export interface UpdateHomeOwnerDTO {
  full_name?: string;
  phone_no: string;
  country_code: string;
  profile_url: string;
  alias_name?: string;
  address?: any;
  push_notification_enabled?: boolean;
}

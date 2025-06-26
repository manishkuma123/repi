export interface UserSignupRequestDTO {
  email?: string;

  password?: string;

  phone_no: string;

  country_code: string;

  apple_id?: string;

  google_id?: string;

  full_name?: string;

  profile_name?: string;

  alias_name?: string;

  role?: string;

  last_login?: Date;

  isVerified?: boolean;
}

import { Role } from 'aws-sdk/clients/budgets';

export interface UserSigninRequestDTO {
  email?: string;
  password?: string;
  country_code?: string;
  phone_no?: string;
  user_agent?: string;
  host_ip?: string;
  role?: Role;
}

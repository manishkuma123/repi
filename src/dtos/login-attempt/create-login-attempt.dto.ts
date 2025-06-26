import { LoginStatus, LoginType, UserAgent } from 'src/utils/enum';

export interface CreateLoginAttemptDTO {
  user_id: string;
  login_type?: LoginType;
  host_ip?: string;
  user_agent?: string;
  status?: LoginStatus;
}

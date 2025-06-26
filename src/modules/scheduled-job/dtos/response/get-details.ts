import { eAPIResultStatus } from 'src/utils/enum';

export class GetDetailsResponseDTO {
  status: eAPIResultStatus;
  invalidMonth?: boolean;
  upcoming_appointment?: any[];
  appointment_log?: any[];
}

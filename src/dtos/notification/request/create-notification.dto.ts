import { NotificationType, Role } from 'src/utils/enum';

export class CreateNotificationRequestDTO {
  image?: string;
  title: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  receiver_type: Role;
  sender_type: Role;
  notification_type: NotificationType;
}

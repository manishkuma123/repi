import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as OneSignal from 'onesignal-node';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { CreateNotificationRequestDTO } from 'src/dtos/notification/request/create-notification.dto';
import { Notification, NotificationDocument } from 'src/entitites/notification';
import { User, UserDocument } from 'src/entitites/user';
import { eAPIResultStatus, Role } from 'src/utils/enum';

@Injectable()
export class NotificationHomeOwnerService {
  private oneSignalClient: OneSignal.Client;

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {
    this.oneSignalClient = new OneSignal.Client(
      '67a5fdaa-dff0-4221-9c83-915771f82af2',
      'YzY3Y2NmNjgtYjkzZS00ZDIxLWJlMDQtM2NjMzJjZTFmZWQ5',
    );
  }

  async sendNotification(
    createNotificationRequestDTO: CreateNotificationRequestDTO,
  ) {
    const receiver = await this.userModel.findById(
      createNotificationRequestDTO?.receiver_id,
    );

    if (!receiver) {
      return;
    }

    if (receiver?.push_notification_enabled == false) {
      return;
    }

    const notification = {
      contents: { en: createNotificationRequestDTO?.content },
      headings: { en: createNotificationRequestDTO?.title },
      include_external_user_ids: [createNotificationRequestDTO?.receiver_id],
      // android_channel_id: 'Mindhome-Owner',
    };

    try {
      await this.notificationModel.create(createNotificationRequestDTO);
      await this.oneSignalClient.createNotification(notification);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async getNotification(receiver_id: string): Promise<ResponseDTO> {
    try {
      const data = await this.notificationModel.find({
        receiver_id,
        receiver_type: Role.Customer,
      });

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }
}

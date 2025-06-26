import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NotificationType, Role } from 'src/utils/enum';
import { User } from './user';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop()
  image: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  sender_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  receiver_id: Types.ObjectId;

  @Prop({ type: String, enum: Role, required: true })
  receiver_type: Role;

  @Prop({ type: String, enum: Role, required: true })
  sender_type: Role;

  @Prop({ type: String, enum: NotificationType, required: true })
  notification_type: Role;

  @Prop({ default: false })
  is_read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

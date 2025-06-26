import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { LoginType, UserAgent, LoginStatus } from '../utils/enum';
import { User } from './user';

export type LoginAttemptsDocument = LoginAttempts & Document;

@Schema()
export class LoginAttempts {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user_id: Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  login_date: Date;

  @Prop({
    required: true,
    enum: LoginType,
    default: LoginType.Email,
    type: String,
  })
  login_type: LoginType;

  @Prop({ required: true, default: '127.0.0.1' })
  host_ip: string;

  @Prop({
    required: true,
    enum: UserAgent,
    default: UserAgent.MobileApp,
    type: String,
  })
  user_agent: UserAgent;

  @Prop({
    required: true,
    enum: LoginStatus,
    default: LoginStatus.Failed,
    type: String,
  })
  status: LoginStatus;
}

export const LoginAttemptsSchema = SchemaFactory.createForClass(LoginAttempts);

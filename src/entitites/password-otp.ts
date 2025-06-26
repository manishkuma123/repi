import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user';
import { Role } from 'src/utils/enum';

export type PasswordOtpDocument = PasswordOtp & Document;

@Schema()
export class PasswordOtp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true, enum: Role, type: String })
  role: Role;

  @Prop({ required: true, default: Date.now })
  create_date: Date;

  @Prop({ required: true })
  expiry_time: Date;
}

export const PasswordOtpSchema = SchemaFactory.createForClass(PasswordOtp);

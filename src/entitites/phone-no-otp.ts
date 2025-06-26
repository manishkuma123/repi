import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/utils/enum';

export type PhoneNoOtpDocument = PhoneNoOtp & Document;

@Schema()
export class PhoneNoOtp {
  @Prop({ required: true })
  phone_no: string;

  @Prop({ required: true })
  country_code: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true, enum: Role, type: String })
  role: Role;

  @Prop({ required: true, default: Date.now })
  create_date: Date;

  @Prop({ required: true })
  expiry_time: Date;
}

export const PhoneNoOtpSchema = SchemaFactory.createForClass(PhoneNoOtp);

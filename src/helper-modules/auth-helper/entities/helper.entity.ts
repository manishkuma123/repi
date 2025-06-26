import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { Document } from 'mongoose';

export type HelperDocument = Helper & Document;

@Schema()
export class Helper {
  @Prop({ required: true, unique: true })
  @Expose()
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ required: true })
  @Expose()
  phoneNumber: string;

  @Prop({ default: false })
  @Expose()
  isVerified: boolean;

  @Prop({ required: true })
  @Expose()
  firstName: string;

  @Prop({ required: true })
  @Expose()
  familyName: string;

  @Prop({ required: true })
  @Expose()
  countryCode: string;

  @Prop({ required: true })
  @Expose()
  address1: string;

  @Prop()
  @Expose()
  address2?: string;

  @Prop({ required: true })
  @Expose()
  province: string;

  @Prop({ required: true })
  @Expose()
  district: string;

  @Prop({ required: true })
  @Expose()
  subDistrict: string;

  @Prop({ required: true })
  @Expose()
  zip: string;

  @Prop({ required: true, unique: true })
  @Expose()
  referralCode: string;

  @Prop()
  @Expose()
  image?: string;
}

export const HelperSchema = SchemaFactory.createForClass(Helper);

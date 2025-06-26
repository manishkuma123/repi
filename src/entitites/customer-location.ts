import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user';

export type CustomerLocationDocument = CustomerLocation & Document;

@Schema()
export class CustomerLocation {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  customer_id: Types.ObjectId;

  @Prop({ required: true })
  location_name: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  address_no: string;

  @Prop()
  building_name?: string;

  @Prop()
  floor?: string;

  @Prop()
  room_no?: string;

  @Prop()
  alley_name?: string;

  @Prop()
  village_name?: string;

  @Prop()
  road_name?: string;

  @Prop({ required: true })
  subdistrict: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  province: string;

  @Prop()
  tel_no?: string;

  @Prop()
  note?: string;
}

export const CustomerLocationSchema =
  SchemaFactory.createForClass(CustomerLocation);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user';
import { Role } from 'src/utils/enum';

export type GeoLocationDetailsDocument = GeoLocationDetails & Document;

@Schema()
export class GeoLocationDetails {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user_id: Types.ObjectId;

  @Prop()
  location_name?: string;

  @Prop({ type: [Number], index: '2dsphere', required: true })
  location: [number, number];

  @Prop()
  address_no?: string;

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

  @Prop()
  subdistrict?: string;

  @Prop()
  district?: string;

  @Prop()
  province?: string;

  @Prop()
  phone_no?: string;

  @Prop()
  country_code?: string;

  @Prop()
  note?: string;

  @Prop({ type: String, enum: Role })
  role?: Role;
}

export const GeoLocationDetailsSchema =
  SchemaFactory.createForClass(GeoLocationDetails);

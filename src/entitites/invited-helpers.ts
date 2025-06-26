// make an schema for invited helpers has fields: name , email, lat, lng, corporator_id

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user';
export type InvitedHelperDocument = InvitedHelper & Document;

@Schema({ timestamps: true })
export class InvitedHelper {
  @Prop()
  full_name: string;

  @Prop()
  family_name: string;

  @Prop()
  profile_name: string;

  @Prop()
  profile_url: string;

  @Prop()
  address: string;

  @Prop()
  country_code: string;

  @Prop()
  phone_no: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  lat: number;

  @Prop()
  lng: number;

  @Prop({ default: false })
  status: boolean;

  @Prop()
  corporator_id: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  helper_id: Types.ObjectId;
}

export const InvitedHelperSchema = SchemaFactory.createForClass(InvitedHelper);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user';

export type HomeOwnerAddressDocument = HomeOwnerAddress & Document;

@Schema()
export class HomeOwnerAddress {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  site_name: string;

  @Prop({ required: true })
  contact_name: string;

  @Prop()
  family_name: string;

  @Prop()
  phone_no: string;

  @Prop()
  country_code: string;

  @Prop()
  postal_address: string;

  @Prop({ type: [Number], index: '2dsphere', required: true })
  location: [number, number];
}

export const HomeOwnerAddressSchema =
  SchemaFactory.createForClass(HomeOwnerAddress);

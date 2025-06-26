import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Province } from './provinces';
import { DistrictName } from 'src/utils/Types/interfaces';

export type DistrictDocument = District & Document;

@Schema()
export class District {
  @Prop({ required: true, type: Object })
  name: DistrictName;

  @Prop({ type: Types.ObjectId, required: true, ref: Province.name })
  province_id: Types.ObjectId;
}

export const DistrictSchema = SchemaFactory.createForClass(District);

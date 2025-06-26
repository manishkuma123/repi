import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { District } from './districts';
import { JobName } from 'src/utils/Types/interfaces';

export type SubDistrictDocument = SubDistrict & Document;

@Schema()
export class SubDistrict {
  @Prop({ required: true, type: Object })
  name: JobName;

  @Prop({ type: Types.ObjectId, required: true, ref: District.name })
  district_id: Types.ObjectId;

  @Prop({ required: true })
  zip: number;
}

export const SubDistrictSchema = SchemaFactory.createForClass(SubDistrict);

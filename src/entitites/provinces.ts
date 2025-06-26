import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProvinceDocument = Province & Document;

@Schema()
export class Province {
  @Prop({ required: true })
  name: string;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);

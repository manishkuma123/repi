import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user';

export type HelperEventDocument = HelperEvent & Document;

@Schema()
export class HelperEvent {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  helper_id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  note?: string;

  @Prop({ required: true, type: Date })
  start_date: Date;

  @Prop({ required: true, type: Date })
  end_date: Date;

  @Prop({ required: true })
  start_time: string;

  @Prop({ required: true })
  end_time: string;

  @Prop()
  location?: string;
}

export const HelperEventSchema = SchemaFactory.createForClass(HelperEvent);

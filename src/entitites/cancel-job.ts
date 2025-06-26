import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user';
import { SearchJob } from './search-job';

export type CancelJobDocument = CancelJob & Document;

@Schema({ timestamps: true })
export class CancelJob {
  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  cancel_date: Date;

  @Prop({ type: Types.ObjectId, required: true, ref: SearchJob.name })
  job_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  customer_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  helper_id: Types.ObjectId;
}

export const CancelJobSchema = SchemaFactory.createForClass(CancelJob);

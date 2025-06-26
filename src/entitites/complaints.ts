import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { SearchJob } from './search-job';
import { User } from './user';

export type ComplaintDocument = Complaint & Document;

@Schema({ timestamps: true })
export class Complaint {
  @Prop({ required: true, type: Types.ObjectId, ref: SearchJob.name })
  job_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user_id: Types.ObjectId;

  @Prop({ required: true, type: Object })
  complaint_details: Object;

  @Prop({ required: true, type: String })
  order_number: string;
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);

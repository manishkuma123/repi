import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user';
import { MainJob } from './main-job';
import { JobStatus } from 'src/utils/enum';

export type HelperRegisteredJobDocument = HelperRegisteredJob & Document;

@Schema()
export class HelperRegisteredJob {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  helper_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: MainJob.name, required: true })
  main_job_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: MainJob.name, required: true })
  sub_job_id: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  registered_date: Date;

  @Prop({ required: false })
  certificate_id: string;

  @Prop({ required: false })
  trainings: Object[];

  @Prop({ type: String, enum: JobStatus, required: false })
  job_status: JobStatus;

  @Prop({ required: true })
  address: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  videos: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  siteDetails: string;
}

export const HelperRegisteredJobSchema =
  SchemaFactory.createForClass(HelperRegisteredJob);

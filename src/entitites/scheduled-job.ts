import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model, Types } from 'mongoose';
import { User } from './user';
import { SearchJob } from './search-job';
import { JobProgress } from 'src/utils/enum';
import { generateOrderNumber } from 'src/utils/globalFunctions';

export type ScheduledJobDocument = ScheduledJob & Document;

@Schema()
export class ScheduledJob {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  helper_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  customer_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: SearchJob.name })
  job_id: Types.ObjectId;

  @Prop({ enum: JobProgress, type: String, default: JobProgress.Pending })
  job_status: JobProgress;

  @Prop({ type: String, unique: true, sparse: true }) // Ensures uniqueness but allows null values
  order_number: string;
 
  @Prop({ required: true })
  price: number;

  @Prop({ type: Number })
  total_rating: number;

  @Prop({ type: Number })
  customer_rating: number;

  @Prop({ type: Date })
  started_date: Date; //exact date when the job started

  @Prop({ type: Date })
  completed_date: Date; //exact date when the job completed

  @Prop({ type: [String] })
  media: string[];

  @Prop({ type: mongoose.Schema.Types.Mixed })
  started_time_stamp: bigint; //exact date when the job started

  @Prop({ type: mongoose.Schema.Types.Mixed })
  completed_time_stamp: bigint; //exact date when the job completed

  @Prop({ type: String })
  description: string;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ type: Date })
  warranty_expiration_date: Date; //exact date when the warranty expiration

  @Prop({ default: false })
  sent_review_notification: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const ScheduledJobSchema = SchemaFactory.createForClass(ScheduledJob);

async function generateUniqueOrderNumber(
  model: Model<ScheduledJobDocument>,
): Promise<string> {
  let orderNumber: string;
  let exists = true;

  while (exists) {
    orderNumber = generateOrderNumber();
    exists = !!(await model.exists({ order_number: orderNumber }));
  }

  return orderNumber;
}

// Pre-save hook to ensure unique order_number
ScheduledJobSchema.pre<ScheduledJobDocument>('save', async function (next) {
  if (!this.order_number) {
    this.order_number = await generateUniqueOrderNumber(
      this.constructor as Model<ScheduledJobDocument>,
    );
  }
  next();
});

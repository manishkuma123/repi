import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ScheduledJob } from './scheduled-job';
import { User } from './user';

export type HelperJobReviewDocument = HelperJobReview & Document;

@Schema({ timestamps: true })
export class HelperJobReview {
  @Prop({ type: Types.ObjectId, required: true, ref: ScheduledJob.name })
  scheduled_job_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  helper_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  customer_id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  punctual_rating: number;

  @Prop({ type: Number, required: true })
  courteous_rating: number;

  @Prop({ type: Number, required: true })
  efficient_rating: number;

  @Prop({ type: Number, required: true })
  productive_rating: number;

  @Prop({ type: [String] })
  media_urls: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: String })
  additional_feedback: string;

  @Prop({ type: Boolean, default: false })
  show_reviewer_name: boolean;

  @Prop({ type: String })
  reviewer_name: string;
}

export const HelperJobReviewSchema =
  SchemaFactory.createForClass(HelperJobReview);

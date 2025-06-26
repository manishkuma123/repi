import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { SearchJob } from './search-job';
import { OfferStatus } from 'src/utils/enum';

export type PostponedJobDocument = PostponedJob & Document;

@Schema({ timestamps: true })
export class PostponedJob {
  @Prop({ required: true, ref: SearchJob.name, type: Types.ObjectId })
  job_id: Types.ObjectId;

  @Prop({ type: Number })
  postponed_no: number;

  @Prop({ type: Date })
  start_date: Date;

  @Prop({ type: Date })
  end_date: Date;

  @Prop({ type: Date })
  start_time: Date;

  @Prop({ type: Date })
  end_time: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  start_time_stamp: bigint;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  end_time_stamp: bigint;

  @Prop({
    enum: OfferStatus,
    type: String,
    default: OfferStatus.Pending,
    required: true,
  })
  status: string;
}

export const PostponedJobSchema = SchemaFactory.createForClass(PostponedJob);

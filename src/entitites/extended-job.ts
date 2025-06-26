import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { SearchJob } from './search-job';
import { OfferStatus } from 'src/utils/enum';

export type ExtendedJobDocument = ExtendedJob & Document;

@Schema({ timestamps: true })
export class ExtendedJob {
  @Prop({ required: true, ref: SearchJob.name, type: Types.ObjectId })
  job_id: Types.ObjectId;

  @Prop({ required: true })
  cause: string;

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

  @Prop()
  note: string;

  @Prop({ type: [String], default: [] })
  media: string[];

  @Prop({
    enum: OfferStatus,
    type: String,
    default: OfferStatus.Pending,
    required: true,
  })
  status: string;
}

export const ExtendedJobSchema = SchemaFactory.createForClass(ExtendedJob);

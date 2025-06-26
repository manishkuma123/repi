import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { SearchJob } from './search-job';
import { User } from './user';
import { OfferStatus } from 'src/utils/enum';
import { HomeOwnerAddress } from './home-owner-address';
import { JobName } from 'src/utils/Types/interfaces';
import { SubJob } from './sub-job';
import { MainJob } from './main-job';

export type HelperOfferDocument = HelperOffer & Document;

@Schema({ timestamps: true })
export class HelperOffer {
  @Prop({ type: Types.ObjectId, ref: SearchJob.name, required: true })
  job_id: Types.ObjectId;

  @Prop({ required: true, ref: MainJob.name, type: Types.ObjectId })
  main_job_id: Types.ObjectId;

  @Prop({ required: true, ref: SubJob.name, type: Types.ObjectId })
  sub_job_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  helper_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  customer_id: Types.ObjectId;

  @Prop({ required: true, ref: HomeOwnerAddress.name, type: Types.ObjectId })
  address_id: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  media: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ type: Date })
  start_date: Date;

  @Prop({ type: Date })
  end_date: Date;

  @Prop({ required: true, type: [Object] })
  job_descriptions: JobName[];

  @Prop({
    enum: OfferStatus,
    type: String,
    default: OfferStatus.Pending,
    required: true,
  })
  status: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  start_time_stamp: bigint;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  end_time_stamp: bigint;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const HelperOfferSchema = SchemaFactory.createForClass(HelperOffer);

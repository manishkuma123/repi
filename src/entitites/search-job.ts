import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from './user';
import { MainJob } from './main-job';
import { SubJob } from './sub-job';
import { JobName } from 'src/utils/Types/interfaces';
import { HomeOwnerAddress } from './home-owner-address';

export type SearchJobDocument = SearchJob & Document;

@Schema()
export class SearchJob {
  @Prop({ required: true, ref: User.name, type: Types.ObjectId })
  customer_id: Types.ObjectId;

  @Prop({ required: true, ref: MainJob.name, type: Types.ObjectId })
  main_job_id: Types.ObjectId;

  @Prop({ required: true, ref: SubJob.name, type: Types.ObjectId })
  sub_job_id: Types.ObjectId;

  @Prop({ required: true, ref: HomeOwnerAddress.name, type: Types.ObjectId })
  address_id: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  media: string[]; //images and videos

  @Prop({ required: true, type: [Object] })
  prior_job: JobName[];

  @Prop({ required: true, type: [Object] })
  pre_conditions_check_list: JobName[];

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  time_taken_hours: number;

  @Prop()
  site_details: string;

  @Prop({ type: Date })
  start_date: Date;

  @Prop({ type: Date })
  end_date: Date;

  @Prop({ type: Date })
  extended_start_date: Date;

  @Prop({ type: Date })
  extended_end_date: Date;

  @Prop({ type: Date })
  time: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  start_time_stamp: bigint;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  end_time_stamp: bigint;
}

export const SearchJobSchema = SchemaFactory.createForClass(SearchJob);

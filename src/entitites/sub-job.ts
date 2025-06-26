import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  GoodItem,
  JobName,
  ServiceFee,
  WorkingHour,
} from 'src/utils/Types/interfaces';
import { MainJob } from './main-job';
import { JobType } from 'src/utils/enum';

export type SubJobDocument = SubJob & Document;

@Schema()
export class SubJob {
  @Prop({ required: true, type: Object })
  sub_job_name: JobName;

  @Prop({ type: Types.ObjectId, required: true, ref: MainJob.name })
  main_job_id: Types.ObjectId;

  @Prop({ required: true, default: false })
  ar_app_type: boolean;

  @Prop({ required: true })
  min_labor: number;

  @Prop({ required: true, enum: JobType, type: String })
  job_type: JobType;

  @Prop({ required: true, type: [Object] })
  good_list: GoodItem[];

  @Prop({ required: true, type: Object })
  service_fee: ServiceFee;

  @Prop({ required: true, type: Object })
  working_hour: ServiceFee;

  @Prop({ required: true, type: [Object] })
  job_descriptions: JobName[];

  @Prop({ required: true, type: [Object] })
  helper_provided_tool: JobName[];

  @Prop({ required: true, type: [Object] })
  prior_job: JobName[];

  @Prop({ required: true, type: [Object] })
  pre_conditions: JobName[];
}

export const SubJobSchema = SchemaFactory.createForClass(SubJob);

SubJobSchema.index({ 'sub_job_name.en': 'text' });

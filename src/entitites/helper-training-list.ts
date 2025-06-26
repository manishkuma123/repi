import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Session } from 'src/utils/Types/interfaces';
import { MainJob } from './main-job';
import { SubJob } from './sub-job';

export type HelperTrainingListDocument = HelperTrainingList & Document;

@Schema()
export class HelperTrainingList {
  @Prop({ required: true, ref: MainJob.name, type: Types.ObjectId })
  main_job_id: Types.ObjectId;

  @Prop({ required: true })
  main_job_name: string;

  @Prop({
    required: true,
    ref: SubJob.name,
    type: Types.ObjectId,
    unique: true,
  })
  sub_job_id: Types.ObjectId;

  @Prop({ required: true })
  sub_job_name: string;

  @Prop({ type: [Object], required: true })
  sessions: Session[];
}

export const HelperTrainingListSchema =
  SchemaFactory.createForClass(HelperTrainingList);

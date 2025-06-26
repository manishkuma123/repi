import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user';
import { MainJob } from './main-job';
import { SubJob } from './sub-job';
import { JobStatus } from 'src/utils/enum';

export type HelperSkillDocument = HelperSkill & Document;

@Schema()
export class HelperSkill {
  @Prop({ type: Types.ObjectId, required: true, ref: MainJob.name })
  main_job_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: SubJob.name })
  sub_job_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  helper_id: string;

  @Prop({ default: Date.now })
  registered_date: Date;

  // @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  // certificate_id: string;

  @Prop({ type: Map, of: Boolean, default: {} })
  trainings: Map<string, boolean>;

  @Prop({ default: JobStatus.Training_Pending, type: String })
  job_status: JobStatus;

  @Prop({ default: true, type: Boolean })
  is_enabled: boolean;
}

export const HelperSkillSchema = SchemaFactory.createForClass(HelperSkill);

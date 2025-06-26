import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MainJob } from 'src/entitites/main-job';
import { SubJob } from 'src/entitites/sub-job';

@Schema()
export class SiteCheckListHelper extends Document {
  @Prop({ type: Types.ObjectId, ref: MainJob.name, required: true })
  mainJobId: string;

  @Prop({ type: Types.ObjectId, ref: SubJob.name, required: true })
  subJobId: string;

  @Prop({ required: true })
  title: string;
}

export const SiteCheckListHelperSchema =
  SchemaFactory.createForClass(SiteCheckListHelper);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MainJob } from 'src/entitites/main-job';
import { SubJob } from 'src/entitites/sub-job';
import { Helper } from 'src/helper-modules/auth-helper/entities/helper.entity';

export type ExpertiseHelperDocument = ExpertiseHelper & Document;

@Schema()
export class ExpertiseHelper {
  @Prop({ type: Types.ObjectId, required: true, ref: MainJob.name })
  mainJobId: string;

  @Prop({ type: Types.ObjectId, required: true, ref: SubJob.name })
  subJobId: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Helper.name })
  helperId: string;
}

export const ExpertiseHelperSchema =
  SchemaFactory.createForClass(ExpertiseHelper);

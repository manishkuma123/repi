import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { JobName } from 'src/utils/Types/interfaces';

export type MainJobDocument = MainJob & Document;

@Schema()
export class MainJob {
  @Prop({ required: true, type: Object })
  main_job_name: JobName;
}

export const MainJobSchema = SchemaFactory.createForClass(MainJob);

MainJobSchema.index({ 'main_job_name.en': 'text' });

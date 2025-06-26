import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Test } from 'src/utils/Types/interfaces';

export type HelperTrainingExamDocument = HelperTrainingExam & Document;

@Schema()
export class HelperTrainingExam {
  @Prop({ required: true, unique: true })
  session_id: string;

  @Prop({ type: [Object], required: true })
  tests: Test[];
}

export const HelperTrainingExamSchema =
  SchemaFactory.createForClass(HelperTrainingExam);

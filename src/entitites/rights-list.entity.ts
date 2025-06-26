import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RightsModule } from './rights-module.entity';

export type RightsListDocument = RightsList & Document;

@Schema({ timestamps: true })
export class RightsList {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ type: Types.ObjectId, ref: 'RightsModule', required: true })
  moduleId: Types.ObjectId;

  // Virtual field for module details
  module?: RightsModule;
}

export const RightsListSchema = SchemaFactory.createForClass(RightsList);

// Add virtual populate for module
RightsListSchema.virtual('module', {
  ref: 'RightsModule',
  localField: 'moduleId',
  foreignField: '_id',
  justOne: true
});

RightsListSchema.set('toJSON', { virtuals: true });
RightsListSchema.set('toObject', { virtuals: true });
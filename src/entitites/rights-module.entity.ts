import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RightsModuleDocument = RightsModule & Document;

@Schema({ timestamps: true })
export class RightsModule {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  // Virtual field for rights list
  rightsList?: any[];
}

export const RightsModuleSchema = SchemaFactory.createForClass(RightsModule);

// Add virtual populate for rightsList
RightsModuleSchema.virtual('rightsList', {
  ref: 'RightsList',
  localField: '_id',
  foreignField: 'moduleId'
});

// Ensure virtual fields are serialized
RightsModuleSchema.set('toJSON', { virtuals: true });
RightsModuleSchema.set('toObject', { virtuals: true });
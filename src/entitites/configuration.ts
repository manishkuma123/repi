import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConfigurationDocument = Configuration & Document;

@Schema({ timestamps: true })
export class Configuration {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  value: string;

  @Prop({ required: true })
  description: string;
 
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);

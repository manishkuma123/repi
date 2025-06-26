import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model, Types } from 'mongoose';
import { ScheduledJob } from './scheduled-job';

export type HelperPointWalletDocument = HelperPointWallet & Document;

@Schema()
export class HelperPointWallet {
	@Prop({ type: String, required: true })
  	helper_id: string;

	@Prop({ type: Types.ObjectId, ref: 'ScheduledJob' })
  	scheduled_job_id: Types.ObjectId;

  	@Prop({ required: true })
  	point: number;

  	@Prop({ type: String, required: true })
  	type: string; 

  	@Prop({ type: String })
  	sub_type: string;	

  	@Prop({ type: String, required: true })
  	status: string;

  	@Prop({ type: String, required: true })
  	description: string;

  	@Prop({ type: Date })
  	expiration_date: Date;

  	@Prop({ type: Date })
  	transaction_date: Date;
}

export const HelperPointWalletSchema = SchemaFactory.createForClass(HelperPointWallet);
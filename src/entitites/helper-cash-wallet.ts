import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model, Types } from 'mongoose';
import { ScheduledJob } from './scheduled-job';

export type HelperCashWalletDocument = HelperCashWallet & Document;

@Schema()
export class HelperCashWallet {
	@Prop({ type: String, required: true })
  	helper_id: string;

	@Prop({ type: Types.ObjectId, ref: 'ScheduledJob' })
  	scheduled_job_id: Types.ObjectId;

  	@Prop({ required: true })
  	amount: number;

  	@Prop({ type: String, required: true })
  	type: string; 	

  	@Prop({ type: String, required: true })
  	status: string;

  	@Prop({ type: String, required: true })
  	description: string;

  	@Prop({ type: Date })
  	transaction_date: Date;
}

export const HelperCashWalletSchema = SchemaFactory.createForClass(HelperCashWallet);
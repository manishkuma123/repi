import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model, Types } from 'mongoose';
import { ScheduledJob } from './scheduled-job';
import { OmiseCharge } from './omise-charge';

export type CustomerCashWalletDocument = CustomerCashWallet & Document;

@Schema()
export class CustomerCashWallet {
	@Prop({ type: String, required: true })
  	customer_id: string;

  	@Prop({ type: Types.ObjectId, ref: 'OmiseCharge' })
  	omise_charges_id: Types.ObjectId;

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

export const CustomerCashWalletSchema = SchemaFactory.createForClass(CustomerCashWallet);
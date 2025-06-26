import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model, Types } from 'mongoose';
import { ScheduledJob } from './scheduled-job';
import { PaymentStatus } from 'src/utils/enum';

export type OmiseChargeDocument = OmiseCharge & Document;

@Schema()
export class OmiseCharge {
	@Prop({ type: Types.ObjectId, required: true, ref: 'ScheduledJob' })
  	scheduled_job_id: Types.ObjectId;

  	@Prop({ type: String, required: true })
  	charge_id: string;

  	@Prop({ required: true })
  	price: number;
  	
  	@Prop({ type: Number })
  	points: number;

  	@Prop({ enum: PaymentStatus, type: String, default: PaymentStatus.Pending })
  	payment_status: PaymentStatus;

  	@Prop({ type: String, required: true })
  	transaction_type: string;

  	@Prop({ type: Date })
  	payment_date: Date;
}

export const OmiseChargeSchema = SchemaFactory.createForClass(OmiseCharge);
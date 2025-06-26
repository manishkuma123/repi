import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user';

export type HelperBankDetailsDocument = HelperBankDetails & Document;

@Schema()
export class HelperBankDetails {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name, unique: true })
  helper_id: Types.ObjectId;

  @Prop({ required: true })
  book_bank_url: string;

  @Prop({ required: true })
  bank: string;

  @Prop({ required: true })
  account_no: string;

  @Prop({ required: true })
  beneficiary_name: string;
}

export const HelperBankDetailsSchema =
  SchemaFactory.createForClass(HelperBankDetails);

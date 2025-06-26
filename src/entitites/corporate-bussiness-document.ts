import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user';

export type CorporateBussinessDocumentDocument = CorporateBussinessDocument &
  Document;

@Schema()
export class CorporateBussinessDocument {
  @Prop({ type: Types.ObjectId, ref: User.name })
  corporate_id: Types.ObjectId;

  @Prop()
  company_register_document: string;

  @Prop()
  company_name: string;

  @Prop()
  address: string;

  @Prop()
  sub_district: string;

  @Prop()
  district: string;

  @Prop()
  province: string;

  @Prop()
  zip_code: string;

  @Prop()
  country: string;

  @Prop()
  is_VAT_registered: boolean;

  @Prop()
  VAT_id: string;

  @Prop()
  is_head_office: boolean;

  @Prop()
  branch_no: string;

  @Prop()
  VAT_address: string;

  @Prop()
  VAT_certification: string;
}

export const CorporateBussinessDocumentSchema = SchemaFactory.createForClass(
  CorporateBussinessDocument,
);

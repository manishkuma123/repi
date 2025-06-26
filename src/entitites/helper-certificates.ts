import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user';
import { OfferStatus } from 'src/utils/enum';

export type HelperCertificateDocument = HelperCertificate & Document;

@Schema()
export class HelperCertificate {
  @Prop({ required: true })
  event_name: string;

  @Prop()
  details?: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  certificate_authority: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({
    required: true,
    enum: OfferStatus,
    default: OfferStatus.Accepted,
    type: String,
  })
  status: OfferStatus;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  helper_id: Types.ObjectId;
}

export const HelperCertificateSchema =
  SchemaFactory.createForClass(HelperCertificate);

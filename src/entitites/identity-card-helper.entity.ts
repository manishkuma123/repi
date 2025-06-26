import { Document, Types } from 'mongoose';
import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { eGender } from 'src/helper-modules/types/enums';
import { User } from 'src/entitites/user';

export type IdentityCardHelperDocument = IdentityCardHelper & Document;

@Schema({ timestamps: true })
export class IdentityCardHelper {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  helper_id: Types.ObjectId;

  @Prop({ required: true })
  th_name: string;

  @Prop({ required: true })
  th_surname: string;

  @Prop({ required: true })
  personal_id: string;

  @Prop({ required: true })
  dob: Date;

  @Prop({ required: true })
  expired_date: Date;

  @Prop({ required: true })
  scanned_card_url: string;
}

export const IdentityCardHelperSchema =
  SchemaFactory.createForClass(IdentityCardHelper);

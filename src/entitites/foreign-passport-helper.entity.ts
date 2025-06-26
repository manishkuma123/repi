import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { eGender } from '../helper-modules/types/enums';
import { User } from 'src/entitites/user';

export type ForeignPassportHelperDocument = ForeignPassportHelper & Document;

@Schema({ timestamps: true })
export class ForeignPassportHelper {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  helper_id: Types.ObjectId;

  @Prop({ required: true })
  en_name: string;

  @Prop({ required: true })
  en_surname: string;

  @Prop({ required: true })
  employer_name: string;

  @Prop({ required: true })
  expiry_date: Date;

  @Prop({ required: true })
  work_permit_front_url: string;

  @Prop({ required: true })
  work_permit_back_url: string;

  @Prop({ required: true })
  work_permit_no: string;

  @Prop({ required: true })
  nationality: string;
}

export const ForeignPassportHelperSchema = SchemaFactory.createForClass(
  ForeignPassportHelper,
);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user';

export type HelperCriminalHistoryCheckDocument = HelperCriminalHistoryCheck &
  Document;

@Schema()
export class HelperCriminalHistoryCheck {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name, unique: true })
  helper_id: Types.ObjectId;

  @Prop({ required: true })
  id_number: string;

  @Prop({ required: true })
  father_name: string;

  @Prop({ required: true })
  mother_name: string;

  @Prop({ required: true })
  official_address: string;
}

export const HelperCriminalHistorySchema = SchemaFactory.createForClass(
  HelperCriminalHistoryCheck,
);

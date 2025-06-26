import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/entitites/user';

export type HelperCompletedSessionDocument = HelperCompletedSession & Document;

@Schema()
export class HelperCompletedSession {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  helper_id: Types.ObjectId;

  @Prop({ required: true })
  session_id: string;

  @Prop({ type: Date, default: Date.now })
  registered_date: Date;
}

export const HelperCompletedSessionSchema = SchemaFactory.createForClass(
  HelperCompletedSession,
);

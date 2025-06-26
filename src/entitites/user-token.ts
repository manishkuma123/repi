import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  access_token: string;

  @Prop({ required: true, default: Date.now })
  create_date: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

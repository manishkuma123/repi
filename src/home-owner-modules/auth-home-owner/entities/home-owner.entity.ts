import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { Document } from 'mongoose';

export type HomeOwnerDocument = HomeOwner & Document;

@Schema()
export class HomeOwner {
  @Prop({ required: true, unique: true })
  @Expose()
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ required: true })
  @Expose()
  phoneNumber: string;

  @Prop({ default: false })
  @Expose()
  isVerified: Boolean;
}

export const HomeOwnerSchema = SchemaFactory.createForClass(HomeOwner);

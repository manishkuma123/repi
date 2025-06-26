
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role, Steps } from 'src/utils/enum';
import { EmergencyContact } from 'src/utils/Types/interfaces';

export type UserStatus = 'active' | 'inactive'; 

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  email?: string;

  @Prop()
  password?: string;

  @Prop()
  phone_no: string;

  @Prop()
  apple_id?: string;

  @Prop()
  google_id?: string;

  @Prop()
  full_name?: string;

  @Prop({ required: true, enum: Role, type: String, default: Role.Customer })
  role: Role;

  @Prop()
  last_login?: Date;

  @Prop({ required: true, default: false })
  isVerified: boolean;

  @Prop({ required: true, default: Date.now })
  registered_date: Date;

  @Prop()
  profile_url?: string;

  @Prop({ default: false })
  isActive?: Boolean;

  @Prop({ default: null })
  inWarranty?: string | null;

  @Prop({ default: 0 })
  ltv?: number;

  @Prop({ type: Types.ObjectId, ref: 'ScheduledJob' })
  last_order_id?: Types.ObjectId;

  @Prop()
  last_order_job?: string;

  @Prop()
  last_helper?: string;

  @Prop()
  trader_name?: string;

  @Prop()
  alias_name?: string;

  @Prop()
  profile_name?: string;

  @Prop()
  country_code?: string;

  @Prop()
  address?: string;

  @Prop()
  address2?: string;

  @Prop()
  province?: string;

  @Prop()
  district?: string;

  @Prop()
  sub_district?: string;

  @Prop()
  zip?: string;

  @Prop()
  referral_code?: string;

  @Prop({ type: Object })
  emergency_contact?: EmergencyContact;

  @Prop()
  engage_with_customers?: string;

  @Prop()
  job_profile_images?: string[];

  @Prop({ required: true, enum: Steps, type: String, default: Steps.First })
  step?: Steps;

  @Prop({ default: 0 })
  points?: number;

  @Prop({ default: false })
  isIdentityVerified?: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', nullable: true })
  corporate_id?: string | null;

  @Prop({ default: true })
  push_notification_enabled: boolean;

  @Prop({ default: 0 })
  defaultWarrantyPeriod?: number;

  @Prop()
  name: string;
 @Prop()
 position:string;

 @Prop()
id_card_front_image?: string;

@Prop()
id_card_back_image?: string;

@Prop()
selfie_with_id_card_image?: string;

@Prop()
certificate_image?: string;
  // ✅ Add status field correctly
  @Prop({ type: String, enum: ['active', 'inactive'], default: 'active' })
  status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user';
import { MainJob } from './main-job';
import { SubJob } from './sub-job';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export type CorporateSkillDocument = CorporateSkill & Document;

@Schema()
export class CorporateSkill {
  @Prop({ type: Types.ObjectId, required: true, ref: MainJob.name })
  main_job_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: SubJob.name })
  sub_job_id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  corporate_id: string;

  @Prop({ default: Date.now })
  registered_date: Date;

  @Prop({ default: true, type: Boolean })
  is_enabled: boolean;
}

export const CorporateSkillSchema =
  SchemaFactory.createForClass(CorporateSkill);

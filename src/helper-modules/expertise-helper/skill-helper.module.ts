import { Module } from '@nestjs/common';
import { HelperSkillController } from './skill-helper.controller';
import { SkilHelperService } from './skill-helper.service';

import { MongooseModule } from '@nestjs/mongoose';
import { HelperSkill, HelperSkillSchema } from 'src/entitites/helper-skills';
import {
  HelperTrainingList,
  HelperTrainingListSchema,
} from 'src/entitites/helper-training-list';
import { AuthHelperModule } from '../auth-helper/auth-helper.module';
import { AuthHomeOwnerModule } from 'src/home-owner-modules/auth-home-owner/auth-home-owner.module';
import {
  CorporateSkill,
  CorporateSkillSchema,
} from 'src/entitites/corporate-skills';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HelperSkill.name, schema: HelperSkillSchema },
      { name: HelperTrainingList.name, schema: HelperTrainingListSchema },
      { name: CorporateSkill.name, schema: CorporateSkillSchema },
    ]),

    AuthHomeOwnerModule,
  ],

  controllers: [HelperSkillController],
  providers: [SkilHelperService],
  exports: [SkilHelperService],
})
export class HelperSkillModule {}

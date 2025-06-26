import { Module } from '@nestjs/common';
import { CorporateSkillController } from './corporate-skill.controller';
import { CorporateSkillService } from './corporate-skill.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CorporateSkill,
  CorporateSkillSchema,
} from 'src/entitites/corporate-skills';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CorporateSkill.name, schema: CorporateSkillSchema },
    ]),
  ],
  controllers: [CorporateSkillController],
  providers: [CorporateSkillService],
  exports: [CorporateSkillService],
})
export class CorporateSkillModule {}

import { Module } from '@nestjs/common';
import { HelperTrainingListController } from './helper-training-list.controller';
import { HelperTrainingListService } from './helper-training-list.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HelperTrainingList,
  HelperTrainingListSchema,
} from 'src/entitites/helper-training-list';
import { AuthHelperModule } from '../auth-helper/auth-helper.module';
import { MainJob, MainJobSchema } from 'src/entitites/main-job';
import { SubJob, SubJobSchema } from 'src/entitites/sub-job';
import { HelperSkill, HelperSkillSchema } from 'src/entitites/helper-skills';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HelperTrainingList.name, schema: HelperTrainingListSchema },
      { name: MainJob.name, schema: MainJobSchema },
      { name: SubJob.name, schema: SubJobSchema },
      { name: HelperSkill.name, schema: HelperSkillSchema },
    ]),
    AuthHelperModule,
  ],
  controllers: [HelperTrainingListController],
  providers: [HelperTrainingListService],
})
export class HelperTrainingListModule {}

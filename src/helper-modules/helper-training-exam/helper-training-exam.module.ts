import { Module } from '@nestjs/common';
import { HelperTrainingExamController } from './helper-training-exam.controller';
import { HelperTrainingExamService } from './helper-training-exam.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HelperTrainingExam,
  HelperTrainingExamSchema,
} from 'src/entitites/helper-training-exam';
import { HelperSkill, HelperSkillSchema } from 'src/entitites/helper-skills';
import { AuthHelperModule } from '../auth-helper/auth-helper.module';
import { User, UserSchema } from 'src/entitites/user';
import {
  InvitedHelper,
  InvitedHelperSchema,
} from 'src/entitites/invited-helpers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HelperTrainingExam.name, schema: HelperTrainingExamSchema },
      { name: HelperSkill.name, schema: HelperSkillSchema },
      { name: User.name, schema: UserSchema },
      { name: InvitedHelper.name, schema: InvitedHelperSchema },
    ]),
    AuthHelperModule,
  ],
  controllers: [HelperTrainingExamController],
  providers: [HelperTrainingExamService],
  exports: [HelperTrainingExamService],
})
export class HelperTrainingExamModule {}

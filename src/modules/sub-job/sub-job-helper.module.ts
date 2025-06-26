import { Module } from '@nestjs/common';
import { SubJobController } from './sub-job.controller';
import { SubJobService } from './sub-job.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthHelperModule } from '../../helper-modules/auth-helper/auth-helper.module';
import { SubJob, SubJobSchema } from 'src/entitites/sub-job';
import { AuthHomeOwnerModule } from 'src/home-owner-modules/auth-home-owner/auth-home-owner.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SubJob.name, schema: SubJobSchema }]),
    AuthHomeOwnerModule,
  ],

  controllers: [SubJobController],
  providers: [SubJobService],
  exports: [SubJobService],
})
export class SubJobModule {}

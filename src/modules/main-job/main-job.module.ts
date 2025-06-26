import { Module } from '@nestjs/common';
import { MainJobController } from './main-job.controller';
import { MainJobService } from './main-job.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MainJob, MainJobSchema } from 'src/entitites/main-job';
import { SubJob, SubJobSchema } from 'src/entitites/sub-job';
import { AuthHomeOwnerModule } from 'src/home-owner-modules/auth-home-owner/auth-home-owner.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MainJob.name, schema: MainJobSchema },
      { name: SubJob.name, schema: SubJobSchema },
    ]),
    AuthHomeOwnerModule,
  ],
  controllers: [MainJobController],
  providers: [MainJobService],
  exports: [MainJobService],
})
export class MainJobModule {}

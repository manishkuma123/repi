import { Module } from '@nestjs/common';
import { HelperController } from './helper.controller';
import { HelperService } from './helper.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/entitites/user';
import { GeoLocationModule } from 'src/helper-modules/geo-location/geo-location.module';
import { CertificatesModule } from 'src/helper-modules/certificates/certificates.module';
import { HelperSkillModule } from 'src/helper-modules/expertise-helper/skill-helper.module';
import { ScheduledJobModule } from 'src/modules/scheduled-job/scheduled-job.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    GeoLocationModule,
    CertificatesModule,
    HelperSkillModule,
    ScheduledJobModule,
  ],
  controllers: [HelperController],
  providers: [HelperService],
})
export class HelperModule {}

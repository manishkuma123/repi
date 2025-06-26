// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';

// import { HelperController } from './controller';
// import { HelperService } from './service';


// import { User, UserSchema } from 'src/entitites/user';

// import { GeoLocationModule } from 'src/helper-modules/geo-location/geo-location.module';
// import { CertificatesModule } from 'src/helper-modules/certificates/certificates.module';
// import { HelperSkillModule } from 'src/helper-modules/expertise-helper/skill-helper.module';
// import { ScheduledJobModule } from 'src/modules/scheduled-job/scheduled-job.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: User.name, schema: UserSchema },
//     ]),
//     GeoLocationModule,
//     CertificatesModule,
//     HelperSkillModule,
//     ScheduledJobModule,
//   ],
//   controllers: [HelperController],
//   providers: [HelperService],
// })
// export class AdminHelperModule {} // Slight rename for a fresh look
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperService } from './service';
import { HelperController } from './controller'; // Adjust path as needed
import { HelperSkillModule } from 'src/helper-modules/expertise-helper/skill-helper.module';
// Import your schemas
import { User, UserSchema } from 'src/entitites/user';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';
import { HelperJobReview, HelperJobReviewSchema } from 'src/entitites/helper-job-review';

// Import helper modules
import { CertificatesModule } from 'src/helper-modules/certificates/certificates.module';
// import { ExpertiseHelperModule } from 'src/helper-modules/expertise-helper/expertise-helper.module';
import { GeoLocationModule } from 'src/helper-modules/geo-location/geo-location.module';
import { ScheduledJobModule } from 'src/modules/scheduled-job/scheduled-job.module';

@Module({
  imports: [
   
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ScheduledJob.name, schema: ScheduledJobSchema },
      { name: HelperJobReview.name, schema: HelperJobReviewSchema },
    ]),
  
    GeoLocationModule,
    CertificatesModule,
    HelperSkillModule,
    ScheduledJobModule,
  ],
  controllers: [HelperController],
  providers: [HelperService],
  exports: [HelperService], // Export if needed in other modules
})
export class AdminHelperModule {}
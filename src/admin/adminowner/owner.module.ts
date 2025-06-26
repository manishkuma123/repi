// import { Module } from '@nestjs/common';
// import { HomeOwnerController } from './home-owner.controller';
// import { HomeOwnerService } from './home-owner.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from 'src/entitites/user';
// import {
//   HomeOwnerAddress,
//   HomeOwnerAddressSchema,
// } from 'src/entitites/home-owner-address';
// import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';
// import {
//   HelperJobReview,
//   HelperJobReviewSchema,
// } from 'src/entitites/helper-job-review';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: User.name, schema: UserSchema },
//       { name: HomeOwnerAddress.name, schema: HomeOwnerAddressSchema },
//       { name: ScheduledJob.name, schema: ScheduledJobSchema },
//       { name: HelperJobReview.name, schema: HelperJobReviewSchema },
//     ]),
//   ],
//   controllers: [HomeOwnerController],
//   providers: [HomeOwnerService],
// })
// export class HomeOwnerModule {}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomerController } from './owner.controller';
import { CustomerService } from './owner.service';

import { User, UserSchema } from 'src/entitites/user';
import { HomeOwnerAddress, HomeOwnerAddressSchema } from 'src/entitites/home-owner-address';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';
import { HelperJobReview, HelperJobReviewSchema } from 'src/entitites/helper-job-review';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: HomeOwnerAddress.name, schema: HomeOwnerAddressSchema }]),
    MongooseModule.forFeature([{ name: ScheduledJob.name, schema: ScheduledJobSchema }]),
    MongooseModule.forFeature([{ name: HelperJobReview.name, schema: HelperJobReviewSchema }]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}

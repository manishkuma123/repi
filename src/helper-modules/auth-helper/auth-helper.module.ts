import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthHelperService } from './auth-helper.service';
import { AuthHelperController } from './auth-helper.controller';
import { JwtStrategy } from '../../utils/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HelperService } from './helper.service';
import { HelperController } from './helper.controller';
import { User, UserSchema } from 'src/entitites/user';
import { Token, TokenSchema } from 'src/entitites/user-token';
import {
  LoginAttempts,
  LoginAttemptsSchema,
} from 'src/entitites/login-attempts';
import { HelperSkill, HelperSkillSchema } from 'src/entitites/helper-skills';
import {
  GeoLocationDetails,
  GeoLocationDetailsSchema,
} from 'src/entitites/geo-location';
import { MainJobModule } from 'src/modules/main-job/main-job.module';
import { SubJobModule } from 'src/modules/sub-job/sub-job-helper.module';
import { HelperSkillModule } from '../expertise-helper/skill-helper.module';
import { IdentityCardHelperModule } from '../identity-card-helper/identity-card-helper.module';
import { HelperBankDetailsModule } from '../helper-bank-details/helper-bank-details.module';
import { HelperCriminalHistoryCheckModule } from '../helper-criminal-history-check/helper-criminal-history-check.module';
import { ForeignPassportHelperModule } from '../foreign-passport-helper/foreign-passport-helper.module';
import { GeoLocationModule } from 'src/helper-modules/geo-location/geo-location.module';
import { PhoneNoOtpHelperModule } from '../phone-no-otp-helper/phone-no-otp-helper.module';

import { Complaint, ComplaintSchema } from 'src/entitites/complaints';
import { ExtendedJob, ExtendedJobSchema } from 'src/entitites/extended-job';
import {
  ForeignPassportHelper,
  ForeignPassportHelperSchema,
} from 'src/entitites/foreign-passport-helper.entity';
import {
  HelperBankDetails,
  HelperBankDetailsSchema,
} from 'src/entitites/helper-bank-details.entity';
import {
  HelperCriminalHistoryCheck,
  HelperCriminalHistorySchema,
} from 'src/entitites/helper-criminal-history-check';
import { HelperEvent, HelperEventSchema } from 'src/entitites/helper-event';
import {
  HelperJobReview,
  HelperJobReviewSchema,
} from 'src/entitites/helper-job-review';
import { HelperOffer, HelperOfferSchema } from 'src/entitites/helper-offer';
import {
  HelperTrainingExam,
  HelperTrainingExamSchema,
} from 'src/entitites/helper-training-exam';
import {
  HelperTrainingList,
  HelperTrainingListSchema,
} from 'src/entitites/helper-training-list';
import {
  HomeOwnerAddress,
  HomeOwnerAddressSchema,
} from 'src/entitites/home-owner-address';
import {
  IdentityCardHelper,
  IdentityCardHelperSchema,
} from 'src/entitites/identity-card-helper.entity';
import { Otp, OtpSchema } from 'src/entitites/otp';
import { PasswordOtp, PasswordOtpSchema } from 'src/entitites/password-otp';
import { PhoneNoOtp, PhoneNoOtpSchema } from 'src/entitites/phone-no-otp';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';
import { SearchJob, SearchJobSchema } from 'src/entitites/search-job';
import { Suggestion, SuggestionSchema } from 'src/entitites/suggestion';
import { Notification, NotificationSchema } from 'src/entitites/notification';
import { CertificatesModule } from '../certificates/certificates.module';
import {
  HelperCertificate,
  HelperCertificateSchema,
} from 'src/entitites/helper-certificates';
import { PostponedJob, PostponedJobSchema } from 'src/entitites/postponed-job';
import {
  InvitedHelper,
  InvitedHelperSchema,
} from 'src/entitites/invited-helpers';
import {
  CorporateSkill,
  CorporateSkillSchema,
} from 'src/entitites/corporate-skills';
import {
  CorporateBussinessDocument,
  CorporateBussinessDocumentSchema,
} from 'src/entitites/corporate-bussiness-document';
import { CorporateSkillModule } from 'src/corporate-modules/corporate-skill/corporate-skill.module';
import { ConfigurationModule } from 'src/modules/configuration/configuration.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
      { name: LoginAttempts.name, schema: LoginAttemptsSchema },
      { name: HelperSkill.name, schema: HelperSkillSchema },
      { name: GeoLocationDetails.name, schema: GeoLocationDetailsSchema },

      { name: Complaint.name, schema: ComplaintSchema },
      { name: ExtendedJob.name, schema: ExtendedJobSchema },
      { name: HelperOffer.name, schema: HelperOfferSchema },

      { name: ForeignPassportHelper.name, schema: ForeignPassportHelperSchema },
      { name: GeoLocationDetails.name, schema: GeoLocationDetailsSchema },
      { name: HelperBankDetails.name, schema: HelperBankDetailsSchema },
      {
        name: HelperCriminalHistoryCheck.name,
        schema: HelperCriminalHistorySchema,
      },
      { name: HelperEvent.name, schema: HelperEventSchema },
      { name: HelperJobReview.name, schema: HelperJobReviewSchema },

      { name: HelperTrainingExam.name, schema: HelperTrainingExamSchema },
      { name: HelperTrainingList.name, schema: HelperTrainingListSchema },
      { name: HomeOwnerAddress.name, schema: HomeOwnerAddressSchema },

      { name: IdentityCardHelper.name, schema: IdentityCardHelperSchema },
      { name: LoginAttempts.name, schema: LoginAttemptsSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: PasswordOtp.name, schema: PasswordOtpSchema },
      { name: PhoneNoOtp.name, schema: PhoneNoOtpSchema },
      { name: ScheduledJob.name, schema: ScheduledJobSchema },
      { name: SearchJob.name, schema: SearchJobSchema },
      { name: Suggestion.name, schema: SuggestionSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: HelperCertificate.name, schema: HelperCertificateSchema },
      { name: PostponedJob.name, schema: PostponedJobSchema },
      { name: InvitedHelper.name, schema: InvitedHelperSchema },
      { name: CorporateSkill.name, schema: CorporateSkillSchema },
      {
        name: CorporateBussinessDocument.name,
        schema: CorporateBussinessDocumentSchema,
      },
    ]),
    HelperSkillModule,
    IdentityCardHelperModule,
    ForeignPassportHelperModule,
    HelperBankDetailsModule,
    HelperCriminalHistoryCheckModule,
    PassportModule,
    GeoLocationModule,
    MainJobModule,
    SubJobModule,
    PhoneNoOtpHelperModule,
    CertificatesModule,
    CorporateSkillModule,
    ConfigurationModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthHelperController, HelperController],
  providers: [AuthHelperService, JwtStrategy, HelperService],
  exports: [JwtModule],
})
export class AuthHelperModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthHomeOwnerModule } from './home-owner-modules/auth-home-owner/auth-home-owner.module';
import { ConfigModule } from '@nestjs/config';
import { OtpHomeOwnerModule } from './home-owner-modules/otp-home-owner/otp-home-owner.module';
import { PasswordOtpHomeOwnerModule } from './home-owner-modules/password-otp-home-owner/password-otp-home-owner.module';
import { AuthHelperModule } from './helper-modules/auth-helper/auth-helper.module';
import { OtpHelperModule } from './helper-modules/otp-helper/otp-helper.module';
import { PasswordOtpHelperModule } from './helper-modules/password-otp-helper/password-otp-helper.module';
import { IdentityCardHelperModule } from './helper-modules/identity-card-helper/identity-card-helper.module';
import { ForeignPassportHelperModule } from './helper-modules/foreign-passport-helper/foreign-passport-helper.module';
import { SubJobModule } from './modules/sub-job/sub-job-helper.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './helper-modules/guards/AuthGuard';
import { SiteCheckListHelperModule } from './helper-modules/site-check-list-helper/site-check-list-helper.module';
import { ActiveJobHelperModule } from './helper-modules/active-job-helper/active-job-helper.module';
import { HelperSkillModule } from './helper-modules/expertise-helper/skill-helper.module';
import { MainJobModule } from './modules/main-job/main-job.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { HelperBankDetailsModule } from './helper-modules/helper-bank-details/helper-bank-details.module';
import { HelperCriminalHistoryCheckModule } from './helper-modules/helper-criminal-history-check/helper-criminal-history-check.module';
import { GeoLocationModule } from './helper-modules/geo-location/geo-location.module';
import { CountryModule } from './modules/country/country.module';
import { ProvinceModule } from './modules/province/province.module';
import { DistrictModule } from './modules/district/district.module';
import { SubDistrictModule } from './modules/sub-district/sub-district.module';
import { JobsModule } from './home-owner-modules/jobs/jobs.module';
import { AddressModule } from './home-owner-modules/address/address.module';
import { OffersModule } from './modules/offers/offers.module';
import { NotificationHelperModule } from './helper-modules/notification-helper/notification-helper.module';
import { NotificationHomeOwnerModule } from './home-owner-modules/home-owner-notification/home-owner-notification.module';
import { HelperEventModule } from './helper-modules/helper-event/helper-event.module';
import { HelperTrainingListModule } from './helper-modules/helper-training-list/helper-training-list.module';
import { HelperTrainingExamModule } from './helper-modules/helper-training-exam/helper-training-exam.module';
import { ScheduledJobModule } from './modules/scheduled-job/scheduled-job.module';
import { PhoneNoOtpHelperModule } from './helper-modules/phone-no-otp-helper/phone-no-otp-helper.module';
import { PhoneNoOtpHomeOwnerModule } from './home-owner-modules/phone-no-otp-home-owner/phone-no-otp-home-owner.module';
import { TwilioModule } from './modules/twilio/twilio.module';
import { ExtendedJobModule } from './modules/extended-job/extended-job.module';
import { ComplaintModule } from './home-owner-modules/complaint/complaint.module';
import { SuggestionModule } from './home-owner-modules/suggestion/suggestion.module';
import { HelperJobReviewModule } from './helper-modules/helper-job-review/helper-job-review.module';
import { PostponedJobModule } from './modules/postponed-job/postponed-job.module';
import { CertificatesModule } from './helper-modules/certificates/certificates.module';
import { CancelJobModule } from './modules/cancel-job/cancel-job.module';
// import { HomeOwnerModule } from './admin/home-owner/home-owner.module';
import { CustomerModule } from './admin/adminowner/owner.module';

// import { HelperModule } from './admin/helper/helper.module';
// import { HelperModule } from './admin/helper/helper.module';
import {AdminAuthModule} from "./admin/auth/auth.module"
import { AdminHelperModule } from './admin/adminhelper/module';


import { OmiseChargeModule } from './modules/omise-charge/omise-charge.module';
import { CorporateBussinessDocumentModule } from './corporate-modules/corporate-bussiness-document/corporate-bussiness-document.module';
import { CorporateSkillModule } from './corporate-modules/corporate-skill/corporate-skill.module';
import { CustomerWalletModule } from './modules/customer-wallet/customer-wallet.module';
import { HelperWalletModule } from './modules/helper-wallet/helper-wallet.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { AuthenticationModule } from './corporate-modules/authentication/authentication.module';
import { PhoneNoOtpModule } from './corporate-modules/phone-no-otp/phone-no-otp.module';
import { WarrantyPeriodHelperModule } from './helper-modules/warranty-period-helper/warranty-period-helper.module';
import { UsersManagementModule } from './corporate-modules/users-management/users-management.module';
import { TeamPerformanceModule } from './corporate-modules/team-performance/team-performance.module';
import { CalenderModule } from './corporate-modules/calender/calender.module';
import {StaffModule} from './admin/staff/module'
import {RightsModule} from './admin/staff/rights.module'
import {StaffModules} from './admin/staff/staff.module'
// const MONGO_URI = "mongodb+srv://manishpdotpitchtechnologies:OSZej5FSl9n1Pu4G@cluster0.roobuyu.mongodb.net/customer_db?retryWrites=true&w=majority&appName=Cluster0";
const MONGO_URI='mongodb+srv://Fk9vY39rhiz1EU1L8a7KwbQisU429JbZ:63TZ1kq759575sNnikGTTw19kghU76iY@mindhome.p1wx5.mongodb.net/test'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),

    MongooseModule.forRoot(MONGO_URI),
    AuthHomeOwnerModule,
    OtpHomeOwnerModule,
    PasswordOtpHomeOwnerModule,
    AuthHelperModule,
    OtpHelperModule,
    PasswordOtpHelperModule,
    IdentityCardHelperModule,
    ForeignPassportHelperModule,
    MainJobModule,
    SubJobModule,
    HelperSkillModule,
    HelperBankDetailsModule,
    HelperCriminalHistoryCheckModule,
    GeoLocationModule,
    CountryModule,
    ProvinceModule,
    DistrictModule,
    SubDistrictModule,
    FileUploadModule,
    JobsModule,
    AddressModule,
    OffersModule,
    NotificationHelperModule,
    NotificationHomeOwnerModule,
    ActiveJobHelperModule,
    HelperEventModule,
    HelperTrainingListModule,
    HelperTrainingExamModule,
    ScheduledJobModule,
    PhoneNoOtpHelperModule,
    PhoneNoOtpHomeOwnerModule,
    TwilioModule,
    ExtendedJobModule,
    ComplaintModule,
    SuggestionModule,
    HelperJobReviewModule,
    PostponedJobModule,
    CertificatesModule,
    CancelJobModule,
    // HomeOwnerModule,
     CustomerModule ,
     RightsModule,
     StaffModules,
    // HelperModule,
    AdminAuthModule,
    AdminHelperModule ,
    OmiseChargeModule,
    CorporateBussinessDocumentModule,
    CorporateSkillModule,
    CustomerWalletModule,
    HelperWalletModule,
    ConfigurationModule,
    AuthenticationModule,
    PhoneNoOtpModule,
    WarrantyPeriodHelperModule,
    UsersManagementModule,
    TeamPerformanceModule,
    CalenderModule,
    StaffModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

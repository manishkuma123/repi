import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthHomeOwnerService } from './auth-home-owner.service';
import { AuthHomeOwnerController } from './auth-home-owner.controller';
import { HomeOwner, HomeOwnerSchema } from './entities/home-owner.entity';
import { JwtStrategy } from '../../utils/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from 'src/entitites/user';
import { Token, TokenSchema } from 'src/entitites/user-token';
import {
  LoginAttempts,
  LoginAttemptsSchema,
} from 'src/entitites/login-attempts';
import { PhoneNoOtpHomeOwnerModule } from '../phone-no-otp-home-owner/phone-no-otp-home-owner.module';
import { Complaint, ComplaintSchema } from 'src/entitites/complaints';
import { ExtendedJob, ExtendedJobSchema } from 'src/entitites/extended-job';
import { HelperOffer, HelperOfferSchema } from 'src/entitites/helper-offer';
import {
  HomeOwnerAddress,
  HomeOwnerAddressSchema,
} from 'src/entitites/home-owner-address';
import { Otp, OtpSchema } from 'src/entitites/otp';
import { PasswordOtp, PasswordOtpSchema } from 'src/entitites/password-otp';
import { PhoneNoOtp, PhoneNoOtpSchema } from 'src/entitites/phone-no-otp';
import { Notification, NotificationSchema } from 'src/entitites/notification';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';
import { SearchJob, SearchJobSchema } from 'src/entitites/search-job';
import { Suggestion, SuggestionSchema } from 'src/entitites/suggestion';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
      { name: LoginAttempts.name, schema: LoginAttemptsSchema },
      { name: Complaint.name, schema: ComplaintSchema },
      { name: Suggestion.name, schema: SuggestionSchema },
      { name: ExtendedJob.name, schema: ExtendedJobSchema },
      { name: HelperOffer.name, schema: HelperOfferSchema },
      { name: HomeOwnerAddress.name, schema: HomeOwnerAddressSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: PasswordOtp.name, schema: PasswordOtpSchema },
      { name: PhoneNoOtp.name, schema: PhoneNoOtpSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: ScheduledJob.name, schema: ScheduledJobSchema },
      { name: SearchJob.name, schema: SearchJobSchema },
    ]),
    PhoneNoOtpHomeOwnerModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthHomeOwnerController],
  providers: [AuthHomeOwnerService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthHomeOwnerModule {}

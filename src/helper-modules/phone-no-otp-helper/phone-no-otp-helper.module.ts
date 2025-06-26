import { Module } from '@nestjs/common';
import { PhoneNoOtpHelperController } from './phone-no-otp-helper.controller';
import { PhoneNoOtpHelperService } from './phone-no-otp-helper.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PhoneNoOtp, PhoneNoOtpSchema } from 'src/entitites/phone-no-otp';
import { User, UserSchema } from 'src/entitites/user';
import { TwilioModule } from 'src/modules/twilio/twilio.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Token, TokenSchema } from 'src/entitites/user-token';
import {
  GeoLocationDetails,
  GeoLocationDetailsSchema,
} from 'src/entitites/geo-location';
import {
  InvitedHelper,
  InvitedHelperSchema,
} from 'src/entitites/invited-helpers';
import { ConfigurationModule } from 'src/modules/configuration/configuration.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhoneNoOtp.name, schema: PhoneNoOtpSchema },
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
      { name: GeoLocationDetails.name, schema: GeoLocationDetailsSchema },
      { name: InvitedHelper.name, schema: InvitedHelperSchema },
    ]),
    TwilioModule,
    ConfigurationModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [PhoneNoOtpHelperController],
  providers: [PhoneNoOtpHelperService],
  exports: [PhoneNoOtpHelperService],
})
export class PhoneNoOtpHelperModule {}

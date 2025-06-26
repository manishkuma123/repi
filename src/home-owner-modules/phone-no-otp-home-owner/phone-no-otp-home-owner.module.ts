import { Module } from '@nestjs/common';
import { PhoneNoOtpHomeOwnerController } from './phone-no-otp-home-owner.controller';
import { PhoneNoOtpHomeOwnerService } from './phone-no-otp-home-owner.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PhoneNoOtp, PhoneNoOtpSchema } from 'src/entitites/phone-no-otp';
import { User, UserSchema } from 'src/entitites/user';
import { TwilioModule } from 'src/modules/twilio/twilio.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhoneNoOtp.name, schema: PhoneNoOtpSchema },
      { name: User.name, schema: UserSchema },
    ]),
    TwilioModule,
  ],
  controllers: [PhoneNoOtpHomeOwnerController],
  providers: [PhoneNoOtpHomeOwnerService],
  exports: [PhoneNoOtpHomeOwnerService],
})
export class PhoneNoOtpHomeOwnerModule {}

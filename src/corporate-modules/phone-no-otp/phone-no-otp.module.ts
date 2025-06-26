import { Module } from '@nestjs/common';
import { PhoneNoOtpController } from './phone-no-otp.controller';
import { PhoneNoOtpService } from './phone-no-otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PhoneNoOtp, PhoneNoOtpSchema } from 'src/entitites/phone-no-otp';
import { TwilioModule } from 'src/modules/twilio/twilio.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhoneNoOtp.name, schema: PhoneNoOtpSchema },
    ]),
    TwilioModule,
  ],
  controllers: [PhoneNoOtpController],
  providers: [PhoneNoOtpService],
  exports: [PhoneNoOtpService],
})
export class PhoneNoOtpModule {}

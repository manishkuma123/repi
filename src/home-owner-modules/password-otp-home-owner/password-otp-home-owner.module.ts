import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordOtpHomeOwnerService } from './password-otp-home-owner.service';
import { PasswordOtpHomeOwnerController } from './password-otp-home-owner.controller';
import { PasswordOtp, PasswordOtpSchema } from 'src/entitites/password-otp';
import { User, UserSchema } from 'src/entitites/user';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PasswordOtp.name, schema: PasswordOtpSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PasswordOtpHomeOwnerController],
  providers: [PasswordOtpHomeOwnerService],
})
export class PasswordOtpHomeOwnerModule {}

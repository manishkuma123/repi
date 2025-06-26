import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordOtpHelperService } from './password-otp-helper.service';
import { PasswordOtpHelperController } from './password-otp-helper.controller';
import { PasswordOtp, PasswordOtpSchema } from 'src/entitites/password-otp';
import { User, UserSchema } from 'src/entitites/user';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PasswordOtp.name, schema: PasswordOtpSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [PasswordOtpHelperController],
  providers: [PasswordOtpHelperService],
})
export class PasswordOtpHelperModule {}

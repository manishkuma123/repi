import { Module } from '@nestjs/common';
import { OtpHelperController } from './otp-helper.controller';
import { OtpHelperService } from './otp-helper.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from 'src/entitites/otp';
import { User, UserSchema } from 'src/entitites/user';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Otp.name, schema: OtpSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [OtpHelperController],
  providers: [OtpHelperService],
  exports: [OtpHelperService],
})
export class OtpHelperModule {}

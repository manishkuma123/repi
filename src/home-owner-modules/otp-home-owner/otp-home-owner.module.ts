import { Module } from '@nestjs/common';
import { OtpHomeOwnerController } from './otp-home-owner.controller';
import { OtpHomeOwnerService } from './otp-home-owner.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/entitites/user';
import { Otp, OtpSchema } from 'src/entitites/otp';
import { AuthHelperModule } from 'src/helper-modules/auth-helper/auth-helper.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Token, TokenSchema } from 'src/entitites/user-token';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Otp.name, schema: OtpSchema },
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [OtpHomeOwnerController],
  providers: [OtpHomeOwnerService],
  exports: [OtpHomeOwnerService],
})
export class OtpHomeOwnerModule {}

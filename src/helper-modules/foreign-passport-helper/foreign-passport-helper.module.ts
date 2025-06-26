import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForeignPassportHelperService } from './foreign-passport-helper.service';
import { ForeignPassportHelperController } from './foreign-passport-helper.controller';
import {
  ForeignPassportHelper,
  ForeignPassportHelperSchema,
} from 'src/entitites/foreign-passport-helper.entity';
import { AuthHomeOwnerModule } from 'src/home-owner-modules/auth-home-owner/auth-home-owner.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ForeignPassportHelper.name, schema: ForeignPassportHelperSchema },
    ]),
    AuthHomeOwnerModule,
  ],
  controllers: [ForeignPassportHelperController],
  providers: [ForeignPassportHelperService],
  exports: [ForeignPassportHelperService],
})
export class ForeignPassportHelperModule {}

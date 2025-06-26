import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IdentityCardHelperService } from './identity-card-helper.service';
import { IdentityCardHelperController } from './identity-card-helper.controller';
import {
  IdentityCardHelper,
  IdentityCardHelperSchema,
} from 'src/entitites/identity-card-helper.entity';
import { AuthHomeOwnerModule } from 'src/home-owner-modules/auth-home-owner/auth-home-owner.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IdentityCardHelper.name, schema: IdentityCardHelperSchema },
    ]),
    AuthHomeOwnerModule,
  ],
  controllers: [IdentityCardHelperController],
  providers: [IdentityCardHelperService],
  exports: [IdentityCardHelperService],
})
export class IdentityCardHelperModule {}

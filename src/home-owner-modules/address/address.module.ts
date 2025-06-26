import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HomeOwnerAddress,
  HomeOwnerAddressSchema,
} from 'src/entitites/home-owner-address';
import { User, UserSchema } from 'src/entitites/user';
import { AuthHomeOwnerModule } from '../auth-home-owner/auth-home-owner.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HomeOwnerAddress.name, schema: HomeOwnerAddressSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthHomeOwnerModule,
  ],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}

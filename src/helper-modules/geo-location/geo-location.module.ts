import { Module } from '@nestjs/common';
import { GeoLocationController } from './geo-location.controller';
import { GeoLocationService } from './geo-location.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GeoLocationDetails,
  GeoLocationDetailsSchema,
} from 'src/entitites/geo-location';
import { AuthHomeOwnerModule } from 'src/home-owner-modules/auth-home-owner/auth-home-owner.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GeoLocationDetails.name, schema: GeoLocationDetailsSchema },
    ]),
    AuthHomeOwnerModule,
  ],

  controllers: [GeoLocationController],
  providers: [GeoLocationService],
  exports: [GeoLocationService],
})
export class GeoLocationModule {}

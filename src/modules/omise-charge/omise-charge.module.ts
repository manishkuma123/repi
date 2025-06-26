import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OmiseChargeService } from './omise-charge.service';
import { OmiseChargeController } from './omise-charge.controller';
import {
  OmiseCharge,
  OmiseChargeSchema,
} from 'src/entitites/omise-charge';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OmiseCharge.name, schema: OmiseChargeSchema }
    ])
  ],
  controllers: [OmiseChargeController],
  providers: [OmiseChargeService],
})
export class OmiseChargeModule {}

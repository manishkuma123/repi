import { Module } from '@nestjs/common';
import { HelperBankDetailsController } from './helper-bank-details.controller';
import { HelperBankDetailsService } from './helper-bank-details.service';
import {
  HelperBankDetailsSchema,
  HelperBankDetails,
} from 'src/entitites/helper-bank-details.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HelperBankDetails.name, schema: HelperBankDetailsSchema },
    ]),
  ],
  controllers: [HelperBankDetailsController],
  providers: [HelperBankDetailsService],
  exports: [HelperBankDetailsService],
})
export class HelperBankDetailsModule {}

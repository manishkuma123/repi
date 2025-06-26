import { Module } from '@nestjs/common';
import { ActiveJobHelperController } from './active-job-helper.controller';
import { ActiveJobHelperService } from './active-job-helper.service';
import { AuthHelperModule } from '../auth-helper/auth-helper.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperOffer, HelperOfferSchema } from 'src/entitites/helper-offer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HelperOffer.name, schema: HelperOfferSchema },
    ]),
    AuthHelperModule,
  ],
  controllers: [ActiveJobHelperController],
  providers: [ActiveJobHelperService],
})
export class ActiveJobHelperModule {}

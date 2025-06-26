import { Module } from '@nestjs/common';
import { SiteCheckListHelperController } from './site-check-list-helper.controller';
import { SiteCheckListHelperService } from './site-check-list-helper.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SiteCheckListHelper,
  SiteCheckListHelperSchema,
} from './entities/site-check-list-helper.entity';
import { AuthHelperModule } from '../auth-helper/auth-helper.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SiteCheckListHelper.name, schema: SiteCheckListHelperSchema },
    ]),
    AuthHelperModule,
  ],
  controllers: [SiteCheckListHelperController],
  providers: [SiteCheckListHelperService],
})
export class SiteCheckListHelperModule {}

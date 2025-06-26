import { Module } from '@nestjs/common';
import { HelperCriminalHistoryCheckController } from './helper-criminal-history-check.controller';
import { HelperCriminalHistoryCheckService } from './helper-criminal-history-check.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HelperCriminalHistorySchema,
  HelperCriminalHistoryCheck,
} from 'src/entitites/helper-criminal-history-check';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HelperCriminalHistoryCheck.name,
        schema: HelperCriminalHistorySchema,
      },
    ]),
  ],
  controllers: [HelperCriminalHistoryCheckController],
  providers: [HelperCriminalHistoryCheckService],
  exports: [HelperCriminalHistoryCheckService],
})
export class HelperCriminalHistoryCheckModule {}

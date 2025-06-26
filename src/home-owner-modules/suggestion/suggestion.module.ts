import { Module } from '@nestjs/common';
import { SuggestionController } from './suggestion.controller';
import { SuggestionService } from './suggestion.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Suggestion, SuggestionSchema } from 'src/entitites/suggestion';
import { JwtService } from '@nestjs/jwt';
import { ScheduledJob, ScheduledJobSchema } from 'src/entitites/scheduled-job';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Suggestion.name, schema: SuggestionSchema },
      { name: ScheduledJob.name, schema: ScheduledJobSchema },
    ]),
  ],
  controllers: [SuggestionController],
  providers: [SuggestionService, JwtService],
})
export class SuggestionModule {}

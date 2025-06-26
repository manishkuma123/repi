import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchJob, SearchJobDocument } from 'src/entitites/search-job';
import { Suggestion, SuggestionDocument } from 'src/entitites/suggestion';
import { CreateSuggestionDTO } from './dtos/request/create-suggestion.dto';
import { CreateSuggestionResponseDTO } from './dtos/response/create-suggestion.dto';
import { eAPIResultStatus } from 'src/utils/enum';
import { GetAllSuggestionResponseDTO } from './dtos/response/get-all-suggestions.dto';
import { GetSuggestionByIdResponseDTO } from './dtos/response/get-by-id.dto';
import {
  ScheduledJob,
  ScheduledJobDocument,
} from 'src/entitites/scheduled-job';

@Injectable()
export class SuggestionService {
  constructor(
    @InjectModel(Suggestion.name)
    private suggestionModel: Model<SuggestionDocument>,
    @InjectModel(ScheduledJob.name)
    private scheduledJobModel: Model<ScheduledJobDocument>,
  ) {}
  async createSuggestion(
    createSuggestioDTO: CreateSuggestionDTO,
    user_id: string,
  ): Promise<CreateSuggestionResponseDTO> {
    try {
      if (createSuggestioDTO?.order_number) {
        const job = await this.scheduledJobModel.findOne({
          order_number: createSuggestioDTO.order_number,
        });
        if (!job) {
          return { status: eAPIResultStatus.Failure, invalidOrderNumber: true };
        }

        const newSuggestion = new this.suggestionModel({
          ...createSuggestioDTO,
          job_id: job.job_id,
          user_id,
        });

        const data = await newSuggestion.save();

        return { status: eAPIResultStatus.Success, data };
      }

      return { status: eAPIResultStatus.Failure, invalidOrderNumber: true };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getAllSuggestions(
    user_id: string,
  ): Promise<GetAllSuggestionResponseDTO> {
    try {
      const suggestions = await this.suggestionModel.find({ user_id });
      return { status: eAPIResultStatus.Success, data: suggestions };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getSuggestionById(
    suggestionId: string,
  ): Promise<GetSuggestionByIdResponseDTO> {
    try {
      const suggestion = await this.suggestionModel.findById(suggestionId);

      if (!suggestion) {
        return { status: eAPIResultStatus.Failure, invalidId: true };
      }
      return { status: eAPIResultStatus.Success, data: suggestion };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }
}

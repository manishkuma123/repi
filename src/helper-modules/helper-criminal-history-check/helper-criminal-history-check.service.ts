import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HelperCriminalHistoryCheck,
  HelperCriminalHistoryCheckDocument,
} from 'src/entitites/helper-criminal-history-check';
import { CreateCriminalHistoryRequestDTO } from './dtos/request/create-criminal-history.dto';
import { CreateCriminalHistoryResponseDTO } from './dtos/response/create-criminal-history.dto';
import { eAPIResultStatus } from 'src/utils/enum';

@Injectable()
export class HelperCriminalHistoryCheckService {
  constructor(
    @InjectModel(HelperCriminalHistoryCheck.name)
    private criminalHistoryModel: Model<HelperCriminalHistoryCheckDocument>,
  ) {}

  async create(
    helper_id: string,
    createCriminalHistoryDto: CreateCriminalHistoryRequestDTO,
  ): Promise<CreateCriminalHistoryResponseDTO> {
    try {
      const createdCriminalHistory = new this.criminalHistoryModel({
        ...createCriminalHistoryDto,
        helper_id,
      });
      const data = await createdCriminalHistory.save();
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      throw new Error();
    }
  }
}

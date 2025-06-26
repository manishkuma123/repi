import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HelperBankDetails,
  HelperBankDetailsDocument,
} from 'src/entitites/helper-bank-details.entity';
import { CreateBankDetailsRequesDTO } from './dtos/request/create-bank-details.dto';
import { CreateBankDetailsResponseDTO } from './dtos/response/create-bank-details.dto';
import { eAPIResultStatus } from 'src/utils/enum';

@Injectable()
export class HelperBankDetailsService {
  constructor(
    @InjectModel(HelperBankDetails.name)
    private bankDetailsModel: Model<HelperBankDetailsDocument>,
  ) {}

  async create(
    helper_id: string,
    createBankDetailsDto: CreateBankDetailsRequesDTO,
  ): Promise<CreateBankDetailsResponseDTO> {
    try {
      const createdBankDetails = new this.bankDetailsModel({
        ...createBankDetailsDto,
        helper_id,
      });
      const data = await createdBankDetails.save();

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      throw new Error();
    }
  }
}

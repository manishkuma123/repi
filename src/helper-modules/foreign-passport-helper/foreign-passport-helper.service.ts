import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ForeignPassportHelper,
  ForeignPassportHelperDocument,
} from '../../entitites/foreign-passport-helper.entity';
import { CreateForeignPassportHelperDTO } from './dto/request/create-foreign-passport-helper.dto';
import { CreateForeignPassportHelperResponseDTO } from './dto/response/create-foreign-passport-helper.dto';
import { eAPIResultStatus } from 'src/utils/enum';

@Injectable()
export class ForeignPassportHelperService {
  constructor(
    @InjectModel(ForeignPassportHelper.name)
    private readonly foreignPassportHelperModel: Model<ForeignPassportHelperDocument>,
  ) {}

  async create(
    helper_id: string,
    createForeignPassportHelperDto: CreateForeignPassportHelperDTO,
  ): Promise<CreateForeignPassportHelperResponseDTO> {
    try {
      const createdForeignPassportHelper = new this.foreignPassportHelperModel({
        ...createForeignPassportHelperDto,
        helper_id,
      });
      const data = await createdForeignPassportHelper.save();
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      console.log(error.message);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async findOne(helper_id: string): Promise<ForeignPassportHelper> {
    const foreignPassport = await this.foreignPassportHelperModel
      .findOne({ helper_id })
      .exec();
    if (!foreignPassport) {
      return null;
    }
    return foreignPassport;
  }
}

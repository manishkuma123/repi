import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateIdentityCardHelperDTO } from './dto/request/create-identity-card-helper.dto';
import {
  IdentityCardHelper,
  IdentityCardHelperDocument,
} from '../../entitites/identity-card-helper.entity';
import { CreateIdentityCardHelperResponseDTO } from './dto/response/create-identity-card-helper.dto';
import { eAPIResultStatus } from 'src/utils/enum';

@Injectable()
export class IdentityCardHelperService {
  constructor(
    @InjectModel(IdentityCardHelper.name)
    private readonly identityCardModel: Model<IdentityCardHelperDocument>,
  ) {}

  async create(
    helper_id: string,
    createIdentityCardDto: CreateIdentityCardHelperDTO,
  ): Promise<CreateIdentityCardHelperResponseDTO> {
    try {
      const existingCard = await this.findOne(helper_id);

      let data = null;
      if (existingCard) {
        data = await this.identityCardModel.findOneAndUpdate(
          { helper_id },
          { ...createIdentityCardDto },
          { new: true },
        );
      } else {
        const createdIdentityCard = new this.identityCardModel({
          ...createIdentityCardDto,
          helper_id,
        });
        data = await createdIdentityCard.save();
      }

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      console.log(error.message);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async findOne(helper_id: string): Promise<IdentityCardHelper> {
    const identityCard = await this.identityCardModel
      .findOne({ helper_id })
      .exec();
    if (!identityCard) {
      return null;
    }
    return identityCard;
  }
}

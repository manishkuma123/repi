import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { HelperOffer, HelperOfferDocument } from 'src/entitites/helper-offer';
import { eAPIResultStatus, OfferStatus } from 'src/utils/enum';

@Injectable()
export class ActiveJobHelperService {
  constructor(
    @InjectModel(HelperOffer.name)
    private readonly helperOfferModel: Model<HelperOfferDocument>,
  ) {}

  async getUpcomingOffers(
    helperId: string,
    month: number,
    year: number,
  ): Promise<ResponseDTO> {
    try {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59);

      const data = await this.helperOfferModel.find({
        helper_id: helperId,
        status: OfferStatus.Accepted,
        start_date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      });

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      console.log('ERROR:: ', error.message);
      return { status: eAPIResultStatus.Failure };
    }
  }
}

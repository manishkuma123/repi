import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HelperCertificate,
  HelperCertificateDocument,
} from 'src/entitites/helper-certificates';
import { CreateHelperCertificateDTO } from './dtos/request/create-certificate.dto';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { eAPIResultStatus, OfferStatus } from 'src/utils/enum';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectModel(HelperCertificate.name)
    private readonly helperCertificateModel: Model<HelperCertificateDocument>,
  ) {}

  async create(
    createHelperCertificateDto: CreateHelperCertificateDTO,
    helper_id: string,
  ): Promise<ResponseDTO> {
    try {
      const createdCertificate = new this.helperCertificateModel({
        ...createHelperCertificateDto,
        helper_id,
      });
      await createdCertificate.save();
      return { status: eAPIResultStatus.Success };
    } catch (error) {
      return { status: eAPIResultStatus.Success };
    }
  }

  async getAllAcceptedCertificatesByHelperId(helper_id: string) {
    const data = await this.helperCertificateModel.find({
      helper_id,
      status: OfferStatus.Accepted,
    });
    return data;
  }
}

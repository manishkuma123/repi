import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CorporateBussinessDocument,
  CorporateBussinessDocumentDocument,
} from 'src/entitites/corporate-bussiness-document';
import { User, UserDocument } from 'src/entitites/user';
import { CreateCorporateBussinessDocumentDTO } from './dtos/request/create.dto';
import { createCorporateBussinessDocumentResponseDTO } from './dtos/response/create.dto';
import { eAPIResultStatus } from 'src/utils/enum';

@Injectable()
export class CorporateBussinessDocumentService {
  constructor(
    @InjectModel(CorporateBussinessDocument.name)
    private corporateBussinessDocumentModel: Model<CorporateBussinessDocumentDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createCorporateBussinessDocument(
    corporate_id: string,
    body: CreateCorporateBussinessDocumentDTO,
  ): Promise<createCorporateBussinessDocumentResponseDTO> {
    try {
      const corporate = await this.userModel.findById(corporate_id);
      if (!corporate) {
        return { status: eAPIResultStatus.Failure, invalidCorporateId: true };
      }

      const existingDocument =
        await this.corporateBussinessDocumentModel.findOne({
          corporate_id: new Types.ObjectId(corporate_id),
        });

      const documentData = {
        corporate_id: new Types.ObjectId(corporate_id),
        company_register_document: body?.company_register_document,
        company_name: body?.company_name,
        address: body?.address,
        sub_district: body?.sub_district,
        district: body?.district,
        province: body?.province,
        zip_code: body?.zip_code,
        country: body?.country,
        is_VAT_registered: body?.is_VAT_registered,
        VAT_id: body?.VAT_id,
        is_head_office: body?.is_head_office,
        branch_no: body?.branch_no,
        VAT_address: body?.VAT_address,
        VAT_certification: body?.VAT_certification,
      };

      if (existingDocument) {
        await this.corporateBussinessDocumentModel.updateOne(
          { corporate_id: new Types.ObjectId(corporate_id) },
          { $set: documentData },
        );
        return { status: eAPIResultStatus.Success };
      }

      const newDocument = new this.corporateBussinessDocumentModel(
        documentData,
      );
      await newDocument.save();

      return { status: eAPIResultStatus.Success };
    } catch (error) {
      console.error('Error creating corporate business document:', error);
      return { status: eAPIResultStatus.Failure };
    }
  }
}

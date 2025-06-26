import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { CreateSubDistrictRequestDTO } from 'src/dtos/sub-district/request/create-sub-district';
import { CreateSubDistrictResponseDTO } from 'src/dtos/sub-district/response/create-sub-district';
import { District, DistrictDocument } from 'src/entitites/districts';
import { SubDistrict, SubDistrictDocument } from 'src/entitites/sub-district';
import { eAPIResultStatus } from 'src/utils/enum';

@Injectable()
export class SubDistrictService {
  constructor(
    @InjectModel(SubDistrict.name)
    private subDistrictModel: Model<SubDistrictDocument>,
    @InjectModel(District.name) private districtModel: Model<DistrictDocument>,
  ) {}

  // Create a new sub-district
  async create(
    createSubDistrictDto: CreateSubDistrictRequestDTO,
  ): Promise<CreateSubDistrictResponseDTO> {
    try {
      const district = await this.districtModel.findById(
        createSubDistrictDto.district_id,
      );

      if (!district) {
        return { status: eAPIResultStatus.Failure, InvalidDistrictId: true };
      }
      const createdSubDistrict = new this.subDistrictModel(
        createSubDistrictDto,
      );
      const data = await createdSubDistrict.save();
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getAllByDistrict(districtId: string): Promise<ResponseDTO> {
    try {
      const data = await this.subDistrictModel.find({
        district_id: new Types.ObjectId(districtId),
      });
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getAll(): Promise<ResponseDTO> {
    try {
      const data = await this.subDistrictModel.find();
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }
}

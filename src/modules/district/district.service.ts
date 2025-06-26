import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateDistrictRequestDTO } from 'src/dtos/district/request/create-district';
import { CreateDistrictResponseDTO } from 'src/dtos/district/response/create-district';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { District, DistrictDocument } from 'src/entitites/districts';
import { Province, ProvinceDocument } from 'src/entitites/provinces';
import { eAPIResultStatus } from 'src/utils/enum';

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(District.name) private districtModel: Model<DistrictDocument>,
    @InjectModel(Province.name) private provinceModel: Model<ProvinceDocument>,
  ) {}

  // Create a new district
  async create(
    createDistrictDto: CreateDistrictRequestDTO,
  ): Promise<CreateDistrictResponseDTO> {
    try {
      const province = await this.provinceModel.findById(
        createDistrictDto.province_id,
      );

      if (!province) {
        return { status: eAPIResultStatus.Failure, InvalidProvinceId: true };
      }
      const createdDistrict = new this.districtModel(createDistrictDto);
      const data = await createdDistrict.save();
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  // Get all districts by province_id
  async getAllByProvince(province_id: string): Promise<ResponseDTO> {
    try {
      const data = await this.districtModel.find({
        province_id: new Types.ObjectId(province_id),
      });

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  // Get all districts
  async getAll(): Promise<ResponseDTO> {
    try {
      const data = await this.districtModel.find();
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }
}

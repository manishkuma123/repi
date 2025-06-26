import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { CreateProvinceRequestDTO } from 'src/dtos/province/request/create-province';
import { CreateProviceResponseDTO } from 'src/dtos/province/response/create-province';
import { Country, CountryDocument } from 'src/entitites/countries';
import { District, DistrictDocument } from 'src/entitites/districts';
import { Province, ProvinceDocument } from 'src/entitites/provinces';
import { SubDistrict, SubDistrictDocument } from 'src/entitites/sub-district';
import { eAPIResultStatus } from 'src/utils/enum';
import * as xlsx from 'xlsx';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectModel(Province.name) private provinceModel: Model<ProvinceDocument>,
    @InjectModel(District.name) private districtModel: Model<DistrictDocument>,
    @InjectModel(SubDistrict.name)
    private subDistrictModel: Model<SubDistrictDocument>,

    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
  ) {}

  async create(
    createProvinceDto: CreateProvinceRequestDTO,
  ): Promise<CreateProviceResponseDTO> {
    try {
      const createdProvince = new this.provinceModel(createProvinceDto);
      const data = await createdProvince.save();
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getAll(): Promise<ResponseDTO> {
    try {
      const data = await this.provinceModel.find();
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async deleteProvincesAndDetails() {
    try {
      const models = [
        this.provinceModel,
        this.districtModel,
        this.subDistrictModel,
      ];

      for (const mod of models as any[]) {
        await mod.deleteMany({});
      }
      return { status: eAPIResultStatus.Success };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async insertProvincesAndDetails(startRow, endRow) {
    try {
      const workbook = xlsx.readFile('ProvincesData.xlsx');
      const sheetName = workbook.SheetNames[0];
      const allData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const data = allData.slice(startRow, endRow);

      for (const row of (data as any) || []) {
        let province = await this.provinceModel.findOne({
          name: row?.ProvinceEng,
        });
        if (!province) {
          province = await this.provinceModel.create({
            name: row?.ProvinceEng,
          });
        }

        let district = await this.districtModel.findOne({
          'name.en': row.DistrictEng,
          province_id: province?._id,
        });
        if (!district) {
          district = await this.districtModel.create({
            name: {
              en: row?.DistrictEng,
              en_short: row?.DistrictEngShort,
              th: row?.DistrictThai,
            },
            province_id: province?._id,
          });
        }

        let subDistrict = await this.subDistrictModel.findOne({
          'name.en': row['Subdistrict EngShort'],
          district_id: district?._id,
        });
        if (!subDistrict) {
          subDistrict = await this.subDistrictModel.create({
            name: {
              en: row['Subdistrict EngShort'],
              th: row['Sub districtThaiShort'],
            },
            district_id: district?._id,
            zip: row?.TambonID,
          });
        }
      }

      return { status: eAPIResultStatus.Success };
    } catch (error) {
      console.error('ERROR', error);
      return { status: eAPIResultStatus.Failure };
    }
  }
}

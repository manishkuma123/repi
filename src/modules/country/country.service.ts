import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCountryRequestDTO } from 'src/dtos/country/request/create-country';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { Country, CountryDocument } from 'src/entitites/countries';
import { eAPIResultStatus } from 'src/utils/enum';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
  ) {}

  async create(
    createCountryDto: CreateCountryRequestDTO,
  ): Promise<ResponseDTO> {
    try {
      const createdCountry = new this.countryModel(createCountryDto);
      const data = await createdCountry.save();
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getAll(): Promise<ResponseDTO> {
    try {
      const data = await this.countryModel.find();
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }
}

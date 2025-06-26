import { Body, Controller, Get, Post } from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryRequestDTO } from 'src/dtos/country/request/create-country';
import { ResponseDTO } from 'src/dtos/general-response/general-response';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  async create(
    @Body() createCountryDto: CreateCountryRequestDTO,
  ): Promise<ResponseDTO> {
    return this.countryService.create(createCountryDto);
  }

  @Get()
  async getAll(): Promise<ResponseDTO> {
    return this.countryService.getAll();
  }
}

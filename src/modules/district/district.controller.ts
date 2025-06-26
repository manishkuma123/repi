import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DistrictService } from './district.service';
import { CreateDistrictRequestDTO } from 'src/dtos/district/request/create-district';
import { CreateDistrictResponseDTO } from 'src/dtos/district/response/create-district';
import { ResponseDTO } from 'src/dtos/general-response/general-response';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Post()
  async create(
    @Body() createDistrictDto: CreateDistrictRequestDTO,
  ): Promise<CreateDistrictResponseDTO> {
    return this.districtService.create(createDistrictDto);
  }

  @Get(':provinceId')
  async getAllByProvince(
    @Param('provinceId') provinceId: string,
  ): Promise<ResponseDTO> {
    return this.districtService.getAllByProvince(provinceId);
  }

  @Get()
  async getAll(): Promise<ResponseDTO> {
    return this.districtService.getAll();
  }
}

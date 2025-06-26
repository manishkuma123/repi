import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SubDistrictService } from './sub-district.service';
import { CreateSubDistrictRequestDTO } from 'src/dtos/sub-district/request/create-sub-district';
import { CreateSubDistrictResponseDTO } from 'src/dtos/sub-district/response/create-sub-district';
import { ResponseDTO } from 'src/dtos/general-response/general-response';

@Controller('sub-district')
export class SubDistrictController {
  constructor(private readonly subDistrictService: SubDistrictService) {}

  @Post()
  async create(
    @Body() createSubDistrictDto: CreateSubDistrictRequestDTO,
  ): Promise<CreateSubDistrictResponseDTO> {
    return this.subDistrictService.create(createSubDistrictDto);
  }

  @Get(':districtId')
  async getAllByDistrict(
    @Param('districtId') districtId: string,
  ): Promise<ResponseDTO> {
    return this.subDistrictService.getAllByDistrict(districtId);
  }

  @Get()
  async getAll(): Promise<ResponseDTO> {
    return this.subDistrictService.getAll();
  }
}

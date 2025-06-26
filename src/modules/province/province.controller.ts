import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { CreateProvinceRequestDTO } from 'src/dtos/province/request/create-province';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { CreateProviceResponseDTO } from 'src/dtos/province/response/create-province';

@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Post()
  async create(
    @Body() createProvinceDto: CreateProvinceRequestDTO,
  ): Promise<CreateProviceResponseDTO> {
    return this.provinceService.create(createProvinceDto);
  }

  @Get()
  async getAll(): Promise<ResponseDTO> {
    return this.provinceService.getAll();
  }

  @Post('insert-data/:start_row/:end_row')
  async insertProvincesAndDetails(
    @Param('start_row') start_row: number,
    @Param('end_row') end_row: number,
  ): Promise<CreateProviceResponseDTO> {
    return this.provinceService.insertProvincesAndDetails(start_row, end_row);
  }

  @Delete()
  async deleteProvincesAndDetails() {
    return this.provinceService.deleteProvincesAndDetails();
  }
}

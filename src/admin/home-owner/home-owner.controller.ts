import { Controller, Get, Param } from '@nestjs/common';
import { HomeOwnerService } from './home-owner.service';
import { getAllHomeOwnersResponseDTO } from './dtos/response/get-all-home-owner.dto';
import { ResponseDTO } from 'src/dtos/general-response/general-response';

@Controller('admin/home-owner')
export class HomeOwnerController {
  constructor(private readonly homeOwnerService: HomeOwnerService) {}

  @Get('/data')
  async getAllHomeOwners(): Promise<getAllHomeOwnersResponseDTO> {
    return this.homeOwnerService.getAllHomeOwners();
  }

  @Get('/id/:id')
  async getHomeOwnerById(@Param('id') id: string): Promise<ResponseDTO> {
    return this.homeOwnerService.getHomeOwnerById(id);
  }

  @Get('/order-details/:id')
  async getOrderDetailsById(@Param('id') id: string): Promise<ResponseDTO> {
    return this.homeOwnerService.getOrderDetailsById(id);
  }
}

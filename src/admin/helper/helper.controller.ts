import { Controller, Get, Param } from '@nestjs/common';
import { HelperService } from './helper.service';
import { ResponseDTO } from 'src/dtos/general-response/general-response';

@Controller('admin/helper')
export class HelperController {
  constructor(private readonly helperService: HelperService) {}

  @Get('all')
  async getAllHelpers(): Promise<ResponseDTO> {
    return this.helperService.getAllHelpers();
  }

  @Get('id/:id')
  async getHelperDetailsById(@Param('id') id: string): Promise<ResponseDTO> {
    return this.helperService.getHelperDetailsById(id);
  }

  @Get('order-details/:id')
  async getOrderDetailsById(@Param('id') id: string): Promise<ResponseDTO> {
    return this.helperService.getOrderDetailsById(id);
  }
}

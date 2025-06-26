import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateHomeOwnerAddressRequestDTO } from './dtos/request/create-address.dto';
import { CreateHomeOwnerAddressResponseDTO } from './dtos/response/create-address.dto';
import { AuthGuard } from 'src/helper-modules/guards/AuthGuard';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { UpdateHomeOwnerAddressRequestDTO } from './dtos/request/update-address.dto';
import { UpdateHomeOwnerAddressResponseDTO } from './dtos/response/update-address.dto';

@Controller('home-owner/address')
@UseGuards(AuthGuard)
export class AddressController {
  constructor(private readonly homeOwnerAddressService: AddressService) {}

  @Post()
  async create(
    @Req() req: any,
    @Body() createHomeOwnerAddressDto: CreateHomeOwnerAddressRequestDTO,
  ): Promise<CreateHomeOwnerAddressResponseDTO> {
    return this.homeOwnerAddressService.create(
      req?.user?._id,
      createHomeOwnerAddressDto,
    );
  }

  @Get()
  async getAllByCustomerId(@Req() req: any): Promise<ResponseDTO> {
    return this.homeOwnerAddressService.getAllAddressesByCustomerId(
      req?.user?._id,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHomeOwnerAddressDto: UpdateHomeOwnerAddressRequestDTO,
  ): Promise<UpdateHomeOwnerAddressResponseDTO> {
    return this.homeOwnerAddressService.update(id, updateHomeOwnerAddressDto);
  }
}

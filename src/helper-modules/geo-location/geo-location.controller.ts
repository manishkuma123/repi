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
import { GeoLocationService } from './geo-location.service';
import { GeoLocationDetailsRequestDTO } from 'src/dtos/geo-location/request/create-geo-location';
import { AuthGuard } from 'src/helper-modules/guards/AuthGuard';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { GetHelpersNearByLocationDTO } from 'src/dtos/geo-location/request/get-helpers-based-location-and-distance';
import { GetHelpersNearByLocationResponseDTO } from 'src/dtos/geo-location/response/get-helpers-based-location-and-distance';
import { UpdateGeoLocationDetailsDTO } from './dtos/request/update-geo-location.dto';
import { UpdateHelperGeoLocationResponseDTO } from './dtos/response/update-geo-location.dto';

@Controller('geo-location')
export class GeoLocationController {
  constructor(private readonly geoLocationService: GeoLocationService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createLocation(
    @Body() geoLocationDetailsRequestDTO: GeoLocationDetailsRequestDTO,
    @Req() req: any,
  ): Promise<GetHelpersNearByLocationResponseDTO> {
    return this.geoLocationService.create(
      req?.user,
      geoLocationDetailsRequestDTO,
    );
  }

  @Get()
  async getNearbyLocations(
    @Body() getHelpersNearByLocationDTO: GetHelpersNearByLocationDTO,
  ): Promise<GetHelpersNearByLocationResponseDTO> {
    return this.geoLocationService.findNearbyLocations(
      getHelpersNearByLocationDTO,
    );
  }

  @Patch(':id')
  async updateGeoLocationDetails(
    @Param('id') id: string,
    @Body() updateGeoLocationDetailsDto: UpdateGeoLocationDetailsDTO,
  ): Promise<UpdateHelperGeoLocationResponseDTO> {
    return this.geoLocationService.update(id, updateGeoLocationDetailsDto);
  }
}

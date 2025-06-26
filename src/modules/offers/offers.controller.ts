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
import { OffersService } from './offers.service';
import { CreateHelperOfferRequestDTO } from './dtos/request/create-offer.dto';
import { CreateHelperOfferResponseDTO } from './dtos/response/create-offer.dto';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { AuthGuard } from '../../helper-modules/guards/AuthGuard';
import { UpdateHelperOfferRequestDTO } from './dtos/request/update-offer.dto';
import { UpdateHelperOfferResponseDTO } from './dtos/response/update-offer.dto';
import { GetHelperOfferResponseDTO } from './dtos/response/get-offer-by-id.dto';

@Controller('offers')
@UseGuards(AuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(
    @Body() createJobHelperRequestDTO: CreateHelperOfferRequestDTO,
    @Req() req: any,
  ): Promise<CreateHelperOfferResponseDTO> {
    return this.offersService.create(createJobHelperRequestDTO, req?.user?._id);
  }

  @Get()
  async getPendingOffersByHelperId(@Req() req: any): Promise<ResponseDTO> {
    return this.offersService.getPendingOffersByHelperId(req?.user?._id);
  }

  @Patch('/:_id')
  async updateStatus(
    @Param('_id') _id: string,
    @Body() updateHelperOfferRequestDTO: UpdateHelperOfferRequestDTO,
    @Req() req: any,
  ): Promise<UpdateHelperOfferResponseDTO> {
    return this.offersService.updateStatusByOfferId(
      _id,
      updateHelperOfferRequestDTO,
      req?.user,
    );
  }

  @Get('upcoming-accepted-offer/month/:month/year/:year')
  async getUpcomingOffers(
    @Req() req: any,
    @Param('month') month: number,
    @Param('year') year: number,
  ) {
    return this.offersService.getUpcomingAcceptedOffers(
      req?.user?._id,
      month,
      year,
    );
  }

  @Get('financial-chart')
  async getFinancialChart(@Req() req: any) {
    return this.offersService.getFinancialChart(req?.user?._id);
  }

  @Get('/:_id')
  async getOfferById(
    @Param('_id') _id: string,
    @Req() req: any,
  ): Promise<GetHelperOfferResponseDTO> {
    return this.offersService.getOfferById(_id, req?.user);
  }
}

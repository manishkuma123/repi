import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateHelperTrainingListRequestDTO } from './dtos/request/create.dto';
import { CreateHelperTrainingListResponsetDTO } from './dtos/response/create.dto';
import { HelperTrainingListService } from './helper-training-list.service';
import { AuthGuard } from '../guards/AuthGuard';
import { GetHelperTraningListResponseDTO } from './dtos/response/getHelperTrainingList.dto';

@Controller('helper/training-list')
export class HelperTrainingListController {
  constructor(
    private readonly helperTrainingListService: HelperTrainingListService,
  ) {}

  @Post()
  async create(
    @Body() createDto: CreateHelperTrainingListRequestDTO,
  ): Promise<CreateHelperTrainingListResponsetDTO> {
    return this.helperTrainingListService.create(createDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getHelperTrainingListBasedOnSubJobId(
    @Req() req: any,
  ): Promise<GetHelperTraningListResponseDTO> {
    return this.helperTrainingListService.getHelperTrainingList(req?.user);
  }
}

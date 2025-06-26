import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { HelperCriminalHistoryCheckService } from './helper-criminal-history-check.service';
import { CreateCriminalHistoryRequestDTO } from './dtos/request/create-criminal-history.dto';
import { CreateCriminalHistoryResponseDTO } from './dtos/response/create-criminal-history.dto';
import { AuthGuard } from '../guards/AuthGuard';

@Controller('helper/criminal-history-check')
export class HelperCriminalHistoryCheckController {
  constructor(
    private readonly criminalHistoryService: HelperCriminalHistoryCheckService,
  ) {}

  @Post()
  async create(
    @Req() req: any,
    @Body() createCriminalHistoryDto: CreateCriminalHistoryRequestDTO,
  ): Promise<CreateCriminalHistoryResponseDTO> {
    return this.criminalHistoryService.create(
      req?.user?._id,
      createCriminalHistoryDto,
    );
  }
}

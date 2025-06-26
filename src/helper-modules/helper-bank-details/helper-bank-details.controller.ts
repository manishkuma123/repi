import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { HelperBankDetailsService } from './helper-bank-details.service';
import { CreateBankDetailsRequesDTO } from './dtos/request/create-bank-details.dto';
import { CreateBankDetailsResponseDTO } from './dtos/response/create-bank-details.dto';
import { AuthGuard } from '../guards/AuthGuard';

@Controller('helper/bank-details')
export class HelperBankDetailsController {
  constructor(private readonly bankDetailsService: HelperBankDetailsService) {}

  @Post()
  async create(
    @Req() req: any,
    @Body() createBankDetailsDto: CreateBankDetailsRequesDTO,
  ): Promise<CreateBankDetailsResponseDTO> {
    return this.bankDetailsService.create(req?.user?._id, createBankDetailsDto);
  }
}

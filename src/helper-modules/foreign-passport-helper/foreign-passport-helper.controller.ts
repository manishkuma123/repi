import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ForeignPassportHelperService } from './foreign-passport-helper.service';
import { CreateForeignPassportHelperResponseDTO } from './dto/response/create-foreign-passport-helper.dto';
import { CreateForeignPassportHelperDTO } from './dto/request/create-foreign-passport-helper.dto';
import { AuthGuard } from '../guards/AuthGuard';

@Controller('/helper/foreign-passport')
export class ForeignPassportHelperController {
  constructor(
    private readonly foreignPassportHelperService: ForeignPassportHelperService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Req() req: any,
    @Body() createForeignPassportHelperDto: CreateForeignPassportHelperDTO,
  ): Promise<CreateForeignPassportHelperResponseDTO> {
    return this.foreignPassportHelperService.create(
      req?.user?._id,
      createForeignPassportHelperDto,
    );
  }
}

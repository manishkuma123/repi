import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CreateIdentityCardHelperDTO } from './dto/request/create-identity-card-helper.dto';
import { IdentityCardHelperService } from './identity-card-helper.service';
import { CreateIdentityCardHelperResponseDTO } from './dto/response/create-identity-card-helper.dto';
import { AuthGuard } from '../guards/AuthGuard';

@Controller('helper/identity-card')
export class IdentityCardHelperController {
  constructor(
    private readonly identityCardService: IdentityCardHelperService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Req() req: any,
    @Body() createIdentityCardDto: CreateIdentityCardHelperDTO,
  ): Promise<CreateIdentityCardHelperResponseDTO> {
    return this.identityCardService.create(
      req?.user?._id,
      createIdentityCardDto,
    );
  }
}

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CorporateBussinessDocumentService } from './corporate-bussiness-document.service';
import { CreateCorporateBussinessDocumentDTO } from './dtos/request/create.dto';
import { AuthGuard } from 'src/helper-modules/guards/AuthGuard';
import { createCorporateBussinessDocumentResponseDTO } from './dtos/response/create.dto';

@Controller('corporate-bussiness-document')
@UseGuards(AuthGuard)
export class CorporateBussinessDocumentController {
  constructor(
    private readonly corporateBussnessDocumentService: CorporateBussinessDocumentService,
  ) {}

  @Post('create')
  async createCorporateBussinessDocument(
    @Body() body: CreateCorporateBussinessDocumentDTO,
    @Req() req: any,
  ): Promise<createCorporateBussinessDocumentResponseDTO> {
    return this.corporateBussnessDocumentService.createCorporateBussinessDocument(
      req?.user?._id,
      body,
    );
  }
}

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateHelperCertificateDTO } from './dtos/request/create-certificate.dto';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { CertificatesService } from './certificates.service';
import { AuthGuard } from '../guards/AuthGuard';

@Controller('helper/certificates')
@UseGuards(AuthGuard)
export class CertificatesController {
  constructor(private readonly helperCertificateService: CertificatesService) {}

  @Post()
  async create(
    @Body() createHelperCertificateDto: CreateHelperCertificateDTO,
    @Req() req: any,
  ): Promise<ResponseDTO> {
    return this.helperCertificateService.create(
      createHelperCertificateDto,
      req?.user?._id,
    );
  }
}

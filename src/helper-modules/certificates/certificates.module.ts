import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HelperCertificate,
  HelperCertificateSchema,
} from 'src/entitites/helper-certificates';
import { AuthHomeOwnerModule } from 'src/home-owner-modules/auth-home-owner/auth-home-owner.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HelperCertificate.name, schema: HelperCertificateSchema },
    ]),
    AuthHomeOwnerModule,
  ],

  controllers: [CertificatesController],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}

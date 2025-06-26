import { Module } from '@nestjs/common';
import { CorporateBussinessDocumentController } from './corporate-bussiness-document.controller';
import { CorporateBussinessDocumentService } from './corporate-bussiness-document.service';
import {
  CorporateBussinessDocument,
  CorporateBussinessDocumentSchema,
} from 'src/entitites/corporate-bussiness-document';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/entitites/user';
import { AuthHelperModule } from 'src/helper-modules/auth-helper/auth-helper.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CorporateBussinessDocument.name,
        schema: CorporateBussinessDocumentSchema,
      },
      { name: User.name, schema: UserSchema },
    ]),
    AuthHelperModule,
  ],
  controllers: [CorporateBussinessDocumentController],
  providers: [CorporateBussinessDocumentService],
})
export class CorporateBussinessDocumentModule {}

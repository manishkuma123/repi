// upload.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MongooseModule } from '@nestjs/mongoose';
import { multerOptions } from 'src/utils/media/multer.config';

@Module({
  imports: [
    MulterModule.register(multerOptions),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}

import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/media/multer.config';

@Module({
  imports: [MulterModule.register(multerOptions)],
  controllers: [FileUploadController],
})
export class FileUploadModule {}

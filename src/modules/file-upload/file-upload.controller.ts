import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file-upload')
export class FileUploadController {
  constructor() {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file) {
    try {
      if (!file) {
        throw new Error('File upload failed');
      }
      return { fileURL: file.location };
    } catch (error) {
      console.error('Upload Error :: ', error);
      return { message: 'File upload error', error: error.message };
    }
  }
}

// upload.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MediaService } from "./media.service";

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("upload-image")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file,
    @Req() req,
  ) {
    return await this.mediaService.create(
      req.user.userId,
      file.key
    );
  }

  // @Get()
  // async getAllMedia(@Req() req) {
  //   return await this.mediaService.getAll(req.user.userId);
  // }

  // @Post('delete-media')
  // async deleteMedia(@Req() req, @Body() media) {
  //   return await this.mediaService.deleteImage(req.user.userId, media);
  // }
}

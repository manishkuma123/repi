import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePostponedJobRequestDTO } from './dtos/request/create-postponed-job-request.dto';
import { AuthGuard } from 'src/helper-modules/guards/AuthGuard';
import { PostponedJobService } from './postponed-job.service';
import { CreatePostponedJobRequestResponseDTO } from './dtos/response/create-postponed-job-request.dto';
import { UpdatePostponedJobRequestDTO } from './dtos/request/update-postponed-job-request.dto';
import { GetPostponedJobDetailsResponseDTO } from './dtos/response/get_posponed_job_details.dto';

@Controller('postponed-job')
export class PostponedJobController {
  constructor(private readonly postponedJobService: PostponedJobService) {}

  @UseGuards(AuthGuard)
  @Post()
  createPostponedJob(
    @Req() req: any,
    @Body() createPostponedJobRequestDTO: CreatePostponedJobRequestDTO,
  ): Promise<CreatePostponedJobRequestResponseDTO> {
    return this.postponedJobService.createPostponedJob(
      req?.user?._id,
      createPostponedJobRequestDTO,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updatePostponedJob(
    @Req() req: any,
    @Body() updatePostponedJobRequestDTO: UpdatePostponedJobRequestDTO,
    @Param('id') id: string,
  ): Promise<CreatePostponedJobRequestResponseDTO> {
    return this.postponedJobService.updatePostponedJob(
      req?.user?._id,
      id,
      updatePostponedJobRequestDTO,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getPostponedJobDetails(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<GetPostponedJobDetailsResponseDTO> {
    return this.postponedJobService.getPostponedJob(id);
  }
}

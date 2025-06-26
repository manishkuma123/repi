import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SubJobService } from './sub-job.service';
import { AuthGuard } from '../../helper-modules/guards/AuthGuard';
import { CreateSubJobRequestDTO } from 'src/dtos/sub-job/request/create-sub-job.dto';
import { CreateSubJobResponseDTO } from 'src/dtos/sub-job/response/create-sub-job.dto';
import { GetByMainJobIdResponseDTO } from 'src/dtos/sub-job/response/get-all-sub-job-by-main-job-id.dto';

@Controller('sub-jobs')
export class SubJobController {
  constructor(private readonly subJobService: SubJobService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createSubJobDto: CreateSubJobRequestDTO,
  ): Promise<CreateSubJobResponseDTO> {
    return this.subJobService.create(createSubJobDto);
  }

  @Get(':mainJobId')
  async findAll(
    @Param('mainJobId') mainJobId: string,
  ): Promise<GetByMainJobIdResponseDTO> {
    return this.subJobService.findAll(mainJobId);
  }

  @Delete()
  async deleteAllSubJobs() {
    return this.subJobService.deleteAllSubJobs();
  }
}

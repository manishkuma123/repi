import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MainJobService } from './main-job.service';
import { AuthGuard } from '../../helper-modules/guards/AuthGuard';
import { CreateMainJobRequestDTO } from 'src/dtos/main-job/request/create-main-job.dto';
import { CreateMainJobResponseDTO } from 'src/dtos/main-job/response/create-main-job-dto';
import { GetAllMainJobResponseDTO } from 'src/dtos/main-job/response/get-all-main-job.dto';

@Controller('/main-jobs')
export class MainJobController {
  constructor(private readonly mainJobsService: MainJobService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createMainJobDTO: CreateMainJobRequestDTO,
  ): Promise<CreateMainJobResponseDTO> {
    return this.mainJobsService.create(createMainJobDTO);
  }

  @Get()
  async findAll(): Promise<GetAllMainJobResponseDTO> {
    return this.mainJobsService.findAll();
  }

  @Get('/sub-jobs')
  async findAllWithSubJobs(): Promise<GetAllMainJobResponseDTO> {
    return this.mainJobsService.findAllWithJobs();
  }

  @Delete()
  async deleteAllMainJobsAndSubJobs() {
    return this.mainJobsService.deleteAllMainJobsAndSubJobs();
  }
}

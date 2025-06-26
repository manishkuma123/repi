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
import { ExtendedJobService } from './extended-job.service';
import { CreateExtendedJobDTO } from './dtos/request/create-extended-work.dto';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { AuthGuard } from 'src/helper-modules/guards/AuthGuard';
import { UpdateExtendedJobRequestDTO } from './dtos/request/update-extended-work.dto';
import { UpdateExtendedJobResponseDTO } from './dtos/response/update-extended-work.dto';

@UseGuards(AuthGuard)
@Controller('extended-job')
export class ExtendedJobController {
  constructor(private readonly extendedJobService: ExtendedJobService) {}

  @Post()
  async create(
    @Body() createExtendedJobDto: CreateExtendedJobDTO,
    @Req() req: any,
  ): Promise<ResponseDTO> {
    return this.extendedJobService.create(createExtendedJobDto, req?.user?._id);
  }

  @Get('/latest/:job_id')
  async getLatestExtendedJob(@Param('job_id') job_id: string) {
    return await this.extendedJobService.getLatestExtendedJobByJobId(job_id);
  }

  @Get(':extended_job_id')
  async getExtendedJobById(@Param('extended_job_id') extended_job_id: string) {
    return this.extendedJobService.getExtendedJobById(extended_job_id);
  }

  @Patch('/update-status/:job_id')
  async updateExtendedJobRequestStatus(
    @Param('job_id') job_id: string,
    @Body() updateExtendJobDto: UpdateExtendedJobRequestDTO,
  ): Promise<UpdateExtendedJobResponseDTO> {
    return this.extendedJobService.updateExtendedJobRequestStatus(
      job_id,
      updateExtendJobDto,
    );
  }
}

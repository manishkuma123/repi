import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CancelJobService } from './cancel-job.service';
import { CreateCancelJobDTO } from './dtos/request/create.dto';
import { CreateCancelJobResponseDTO } from './dtos/response/create.dto';
import { AuthGuard } from 'src/helper-modules/guards/AuthGuard';

@Controller('cancel-job')
export class CancelJobController {
  constructor(private readonly cancelJobService: CancelJobService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createCancelJobDto: CreateCancelJobDTO,
  ): Promise<CreateCancelJobResponseDTO> {
    return this.cancelJobService.create(createCancelJobDto);
  }
}

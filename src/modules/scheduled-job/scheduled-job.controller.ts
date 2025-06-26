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
import { ScheduledJobService } from './scheduled-job.service';
import { GetDetailsResponseDTO } from './dtos/response/get-details';
import { AuthGuard } from 'src/helper-modules/guards/AuthGuard';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { UpdateCustomerRatingDTO } from './dtos/request/update-customer-review';
import { UpdateCustomerRatingResponseDTO } from './dtos/response/update-customer-review';
import { UpdateJobStatusDTO } from './dtos/request/update-job-status';
import { CreateCompletedJobDTO } from './dtos/request/create-completed-job';
import { CreateScheduledJobDTO } from './dtos/request/create-scheduled-job';
import { CreateScheduledJobResponseDTO } from './dtos/response/create-schedule-job.dto';

@Controller('scheduled-job')
@UseGuards(AuthGuard)
export class ScheduledJobController {
  constructor(private scheduledJobService: ScheduledJobService) {}

  @Post('/create')
  async createScheduledJob(
    @Body() createScheduledJobDto: CreateScheduledJobDTO,
  ): Promise<CreateScheduledJobResponseDTO> {
    return this.scheduledJobService.createScheduledJob(createScheduledJobDto);
  }

  @Get('customer/:month')
  async getAppointmentsByMonth(
    @Param('month') month: number,
    @Req() req: any,
  ): Promise<GetDetailsResponseDTO> {
    return this.scheduledJobService.getAppointmentsByMonth(
      month,
      req?.user?._id,
    );
  }

  @Get('get-order-numbers-by-customer')
  async getOrderNumbersByCustomer(): Promise<ResponseDTO> {
    return this.scheduledJobService.getOrderNumbersByCustomer();
  }

  @Get('get-order-numbers-by-helper')
  async getOrderNumbersByHelper(): Promise<ResponseDTO> {
    return this.scheduledJobService.getOrderNumbersByHelper();
  }

  @Patch('customer/rating/:id')
  async addCustomerRating(
    @Body() updateCustomerRatingDTO: UpdateCustomerRatingDTO,
    @Param('id') _id: string,
  ): Promise<UpdateCustomerRatingResponseDTO> {
    return this.scheduledJobService.addCustomerRating(
      updateCustomerRatingDTO,
      _id,
    );
  }

  @Patch('update-job-status/:id')
  async UpdateJobStatus(
    @Body() updateJobStatusDTO: UpdateJobStatusDTO,
    @Param('id') _id: string,
  ): Promise<UpdateCustomerRatingResponseDTO> {
    return this.scheduledJobService.updateJobStatus(updateJobStatusDTO, _id);
  }

  @Get('get-completed-jobs')
  async getCompletedJobs(@Req() req: any): Promise<ResponseDTO> {
    return this.scheduledJobService.getCompletedJobs('' + req?.user?._id);
  }

  @Patch('completed-job/:id')
  async AddCompletedJobData(
    @Body() createCompletedJobDTO: CreateCompletedJobDTO,
    @Param('id') _id: string,
  ): Promise<UpdateCustomerRatingResponseDTO> {
    return this.scheduledJobService.addCompletedJobData(
      createCompletedJobDTO,
      _id,
    );
  }

  @Patch('completed-job-status/:id')
  async updateCompletedJobStatus(
    @Body() createCompletedJobDTO: CreateCompletedJobDTO,
    @Param('id') _id: string,
  ): Promise<UpdateCustomerRatingResponseDTO> {
    return this.scheduledJobService.addCompletedJobData(
      createCompletedJobDTO,
      _id,
    );
  }

  @Get('get-job-details/:id')
  async getScheduleJobById(
    @Param('id') _id: string,
  ): Promise<GetDetailsResponseDTO> {
    return this.scheduledJobService.getScheduleJobById(_id);
  }
}

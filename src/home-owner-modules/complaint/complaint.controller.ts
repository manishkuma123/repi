import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDTO } from './dtos/request/create-complaint.dto';
import { CreateComplaintResponseDTO } from './dtos/response/create-complaint.dto';
import { AuthGuard } from 'src/helper-modules/guards/AuthGuard';

@Controller('home-owner/complaint')
@UseGuards(AuthGuard)
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}
  @Post()
  async create(
    @Body() createComplaintDTO: CreateComplaintDTO,
    @Req() req: any,
  ): Promise<CreateComplaintResponseDTO> {
    return this.complaintService.createComplaint(
      createComplaintDTO,
      '' + req?.user?._id,
    );
  }

  @Get()
  async getAll(@Req() req: any): Promise<any> {
    return this.complaintService.getAllComplaints('' + req?.user?._id);
  }

  @Get(':id')
  async getById(@Param('id') complaintId: string): Promise<any> {
    return this.complaintService.getComplaintById(complaintId);
  }
}

import { Injectable, Search } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Complaint, ComplaintDocument } from 'src/entitites/complaints';
import { CreateComplaintDTO } from './dtos/request/create-complaint.dto';
import { CreateComplaintResponseDTO } from './dtos/response/create-complaint.dto';
import { eAPIResultStatus } from 'src/utils/enum';
import { GetAllComplaintsResponseDTO } from './dtos/response/get-all-complaints.dto';
import { GetComplaintByIdResponseDTO } from './dtos/response/get-by-id.to';
import {
  ScheduledJob,
  ScheduledJobDocument,
} from 'src/entitites/scheduled-job';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectModel(Complaint.name)
    private complaintModel: Model<ComplaintDocument>,
    @InjectModel(ScheduledJob.name)
    private scheduledJobModel: Model<ScheduledJobDocument>,
  ) {}
  async createComplaint(
    createComplaintDTO: CreateComplaintDTO,
    user_id: string,
  ): Promise<CreateComplaintResponseDTO> {
    try {
      const { order_number, complaint_details } = createComplaintDTO;
      const job = await this.scheduledJobModel.findOne({ order_number });
      if (!job) {
        return { status: eAPIResultStatus.Failure, invalidOrderNumber: true };
      }
      const newComplaint = new this.complaintModel({
        job_id: job?.job_id,

        order_number,
        complaint_details,
        user_id,
      });
      const data = await newComplaint.save();
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getAllComplaints(
    user_id: string,
  ): Promise<GetAllComplaintsResponseDTO> {
    try {
      const complaints = await this.complaintModel.find({ user_id });
      return { status: eAPIResultStatus.Success, data: complaints };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getComplaintById(
    complaintId: string,
  ): Promise<GetComplaintByIdResponseDTO> {
    try {
      const complaint = await this.complaintModel.findById(complaintId);

      if (!complaint) {
        return { status: eAPIResultStatus.Failure, invalidId: true };
      }
      return { status: eAPIResultStatus.Success, data: complaint };
    } catch (error) {
      return { status: eAPIResultStatus.Failure };
    }
  }
}

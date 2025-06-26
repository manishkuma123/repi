import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HelperEvent, HelperEventDocument } from 'src/entitites/helper-event';
import { User } from 'src/entitites/user';
import { CreateHelperEventDTO } from './dtos/request/create-event.dto';
import { CreateHelperEventResponseDTO } from './dtos/response/create-event.dto';
import { eAPIResultStatus, Role } from 'src/utils/enum';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { DeleteHelperEventResponseDTO } from './dtos/response/delete-event.dto';
import { UpdateHelperEventResponseDTO } from './dtos/response/update-event.dto';
import { UpdateHelperEventDTO } from './dtos/request/update-event.dto';
import { GetAllHelperEventResponseDTO } from './dtos/response/get-all-event.dto';
import { ScheduledJobService } from 'src/modules/scheduled-job/scheduled-job.service';

@Injectable()
export class HelperEventService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,

    @InjectModel(HelperEvent.name)
    private readonly helperEventsModel: Model<HelperEventDocument>,

    private readonly scheduledJobService: ScheduledJobService,
  ) {}

  async createEvent(
    helper_id: string,
    createHelperEventDto: CreateHelperEventDTO,
  ): Promise<CreateHelperEventResponseDTO> {
    try {
      const helperExists = await this.userModel.exists({
        _id: helper_id,
        role: Role.Helper,
      });
      if (!helperExists) {
        return { status: eAPIResultStatus.Failure, invalidHelperId: true };
      }

      const event = new this.helperEventsModel({
        ...createHelperEventDto,
        helper_id,
      });

      const data = await event.save();
      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      console.log('ERROR', error.message);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async deleteEvent(eventId: string): Promise<DeleteHelperEventResponseDTO> {
    try {
      const result = await this.helperEventsModel.deleteOne({ _id: eventId });
      if (result.deletedCount === 0) {
        return { status: eAPIResultStatus.Failure, invalidEventId: true };
      }
      return { status: eAPIResultStatus.Success };
    } catch (error) {
      console.log('ERROR ', error.message);
      return { status: eAPIResultStatus.Failure, invalidEventId: true };
    }
  }

  async updateEvent(
    eventId: string,
    updateData: UpdateHelperEventDTO,
  ): Promise<UpdateHelperEventResponseDTO> {
    try {
      const data = await this.helperEventsModel.findByIdAndUpdate(
        eventId,
        updateData,
        {
          new: true,
        },
      );

      if (!data) {
        return { status: eAPIResultStatus.Failure, invalidEventId: true };
      }

      return { status: eAPIResultStatus.Success, data };
    } catch (error) {
      console.log('ERROR ::', error.message);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async getEventsAndToDoJobsByDate(
    month: number,
    helper_id: string,
  ): Promise<GetAllHelperEventResponseDTO> {
    try {
      if (month < 1 || month > 12) {
        return { status: eAPIResultStatus.Failure, invalidMonth: true };
      }

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const startOfMonth = new Date(currentYear, month - 1, 1);
      const endOfMonth = new Date(currentYear, month, 0, 23, 59, 59, 999);
      const today = new Date();

      const resData = await this.scheduledJobService.getToDoJobsByMonth(
        month,
        helper_id,
      );

      if (resData?.status == eAPIResultStatus.Failure) {
        throw new Error("Failed to fetch helper's upcomming jobs");
      }

      const toDoJobs = resData?.upcoming_appointment;

      const events = await this.helperEventsModel
        .find({
          helper_id,
          $or: [
            { start_date: { $gte: startOfMonth, $lte: endOfMonth } },
            { end_date: { $gte: startOfMonth } },
          ],
        })
        .exec();

      if (month < currentMonth) {
        return {
          status: eAPIResultStatus.Success,
          events,
          toDoJobs,
        };
      } else if (month > currentMonth) {
        return {
          status: eAPIResultStatus.Success,
          events,
          toDoJobs,
        };
      } else {
        const upcoming_events = [];

        for (const event of (events as any[]) || []) {
          if (event?.end_date >= today) {
            upcoming_events.push(event);
          }
        }

        return {
          status: eAPIResultStatus.Success,
          events: upcoming_events,
          toDoJobs,
        };
      }
    } catch (error) {
      console.log('ERROR ::', error.message);
      return { status: eAPIResultStatus.Failure };
    }
  }

  async checkHelperEventExistsDuringDateRange(
    helper_id: string,
    start_date: Date,
    end_date: Date,
    start_time_stamp: Number,
    end_time_stamp: Number,
  ): Promise<boolean> {
    // Convert timestamps to time strings in "HH:MM" format
    const startTimeString = new Date(
      start_time_stamp.valueOf(),
    ).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    const endTimeString = new Date(end_time_stamp.valueOf()).toLocaleTimeString(
      'en-US',
      {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      },
    );

    console.log('start_time ::', startTimeString);
    console.log('end_time ::', endTimeString);

    const data = await this.helperEventsModel.find({
      $and: [
        {
          $or: [
            {
              helper_id,
              start_date: { $lte: end_date },
              end_date: { $gte: start_date },
            },
            {
              helper_id: new Types.ObjectId(helper_id),
              start_date: { $lte: end_date },
              end_date: { $gte: start_date },
            },
          ],
        },
        {
          $or: [
            {
              start_time: { $lte: endTimeString },
              end_time: { $gte: startTimeString },
            },
          ],
        },
      ],
    });
    console.log('====== ::', data);

    if (data.length > 0) {
      return true;
    }

    return false;
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HelperEventService } from './helper-event.service';
import { CreateHelperEventDTO } from './dtos/request/create-event.dto';
import { AuthGuard } from '../guards/AuthGuard';
import { DeleteHelperEventResponseDTO } from './dtos/response/delete-event.dto';
import { UpdateHelperEventDTO } from './dtos/request/update-event.dto';
import { UpdateHelperEventResponseDTO } from './dtos/response/update-event.dto';
import { CreateHelperEventResponseDTO } from './dtos/response/create-event.dto';

@Controller('helper/event')
@UseGuards(AuthGuard)
export class HelperEventController {
  constructor(private readonly helperEventService: HelperEventService) {}

  @Post()
  async createEvent(
    @Req() req: any,
    @Body() createHelperEventDto: CreateHelperEventDTO,
  ): Promise<CreateHelperEventResponseDTO> {
    return this.helperEventService.createEvent(
      req?.user?._id,
      createHelperEventDto,
    );
  }

  @Delete(':id')
  async deleteEvent(
    @Param('id') id: string,
  ): Promise<DeleteHelperEventResponseDTO> {
    return this.helperEventService.deleteEvent(id);
  }

  @Patch(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() updateData: UpdateHelperEventDTO,
  ): Promise<UpdateHelperEventResponseDTO> {
    return this.helperEventService.updateEvent(id, updateData);
  }

  @Get(':month')
  async getEventsAndToDoJobsByDate(
    @Param('month') month: number,
    @Req() req: any,
  ): Promise<CreateHelperEventResponseDTO> {
    return this.helperEventService.getEventsAndToDoJobsByDate(
      +month,
      '' + req?.user?._id,
    );
  }
}

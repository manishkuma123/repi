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
import { HelperService } from './helper.service';
import { GetHelperByNameResponseDTO } from './dto/response/get-helpers-by-name.dto';
import { AuthGuard } from '../guards/AuthGuard';
import { UpdateHelperRequestDTO } from './dto/request/update-helper.dto';
import { InviteHelpersRequestDTO } from './dto/request/invite-helpers.dto';

@Controller('helpers')
export class HelperController {
  constructor(private readonly helperService: HelperService) {}

  //delete all invited helpers
  @Delete('delete-invited-helpers')
  async deleteInvitedHelpers() {
    return this.helperService.deleteAllInvitedHelpers();
  }

  @Get('/get-invite-helpers')
  async getInvitedHelpers() {
    return this.helperService.getInvitedHelpers();
  }

  @UseGuards(AuthGuard)
  @Get('latitude/:latitude/longitude/:longitude')
  async getHelpersByName(
    @Param('latitude') latitude: number,
    @Param('longitude') longitude: number,
    @Query('search') search?: string,
  ): Promise<GetHelperByNameResponseDTO> {
    return this.helperService.getHelpersByNameOrByMainJob(
      +latitude,
      +longitude,
      search,
    );
  }

  @UseGuards(AuthGuard)
  @Patch()
  async updateHelper(@Req() req: any, @Body() body: UpdateHelperRequestDTO) {
    return this.helperService.updateHelper(req?.user?._id, body);
  }

  @UseGuards(AuthGuard)
  @Get()
  getUser(@Req() req: any) {
    return this.helperService.getHelper('' + req?.user?._id, req?.user?.role);
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.helperService.getHelper(id);
  }

  @Delete('/:id')
  deleteHelper(@Param('id') id: string) {
    return this.helperService.deleteHelper(id);
  }

  @Delete()
  deleteAllUserData() {
    return this.helperService.deleteAllUsersData();
  }

  @UseGuards(AuthGuard)
  @Patch('complete-first-step')
  async completeFirstStep(
    @Req() req: any,
    @Body() body: UpdateHelperRequestDTO,
  ) {
    return this.helperService.completeFirstStep(req?.user?._id, body);
  }

  @UseGuards(AuthGuard)
  @Patch('complete-second-step')
  async completeSecondStep(@Req() req: any) {
    return this.helperService.completeSecondStep(req?.user?._id);
  }

  @Post('invite-helper')
  async inviteHelper(@Body() inviteHelpersRequestDTO: InviteHelpersRequestDTO) {
    return this.helperService.importDataFromExcel(inviteHelpersRequestDTO);
  }
}

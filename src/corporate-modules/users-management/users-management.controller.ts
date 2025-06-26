import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  HttpCode,
  Req,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersManagementService } from './users-management.service';
import { CreateHelperDTO } from './dtos/request/create-helper.dto';
import { UpdateHelperDTO } from './dtos/request/update-helper.dto';
import { AuthGuard } from 'src/helper-modules/guards/AuthGuard';
import { GetHelpersDTO } from './dtos/request/get-helpers.dto';

@Controller('corporate/users-management')
@UseGuards(AuthGuard)
export class UsersManagementController {
  constructor(
    private readonly usersManagementService: UsersManagementService,
  ) {}

  @Post('create-helper')
  async createHelper(
    @Req() req: any,
    @Body() createHelperDto: CreateHelperDTO,
  ) {
    console.log('id ::', req.user._id);
    return this.usersManagementService.createHelper(
      req?.user?._id,
      createHelperDto,
    );
  }

  @Patch('update-helper/:id')
  async updateHelper(
    @Param('id') id: string,
    @Body() updateHelperDto: UpdateHelperDTO,
  ) {
    return this.usersManagementService.updateHelper(id, updateHelperDto);
  }

  @Get('helpers')
  async getHelpers(@Req() req: any, @Query() getHelpersDto: GetHelpersDTO) {
    return this.usersManagementService.getHelpers(
      req?.user?._id,
      getHelpersDto,
    );
  }
}

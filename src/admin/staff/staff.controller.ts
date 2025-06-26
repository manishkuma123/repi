
// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   UseGuards,
//   Query,
// } from '@nestjs/common';
// import { StaffService } from './staff.service';
// import { CreateStaffDto } from './dto/create-staff.dto';
// import { UpdateStaffDto } from './dto/update-staff.dto';

// @Controller('admin-staff')
// export class StaffController {
//   constructor(private readonly staffService: StaffService) {}

//   @Post()
//   create(@Body() createStaffDto: CreateStaffDto) {
//     return this.staffService.create(createStaffDto);
//   }

//   @Get()
//   findAll(@Query('role') role?: string) {
//     if (role) {
//       return this.staffService.getStaffByRole(role);
//     }
//     return this.staffService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.staffService.findOne(id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
//     return this.staffService.update(id, updateStaffDto);
//   }

//   @Patch(':id/rights-access')
//   updateRightsAccess(
//     @Param('id') id: string,
//     @Body() rightsAccess: any,
//   ) {
//     return this.staffService.updateRightsAccess(id, rightsAccess);
//   }

//   @Patch(':id/toggle-status')
//   toggleStatus(@Param('id') id: string) {
//     return this.staffService.toggleStaffStatus(id);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.staffService.remove(id);
//   }
// }


import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AdminResetPasswordDto } from './dto/admin-reset-password.dto';
import { SuspendAccountDto } from './dto/suspend-account.dto';

@Controller('admin-staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  findAll(@Query('role') role?: string, @Query('status') status?: string) {
    if (status === 'suspended') {
      return this.staffService.getSuspendedStaff();
    }
    if (status === 'active') {
      return this.staffService.getActiveStaff();
    }
    if (role) {
      return this.staffService.getStaffByRole(role);
    }
    return this.staffService.findAll();
  }




  @Patch('suspend/:id')
suspendStaff(
  @Param('id') id: string,
  @Body('reason') reason: string
) {
  return this.staffService.suspendStaff(id, reason);
}

@Patch('activate/:id')
activateStaff(@Param('id') id: string) {
  return this.staffService.activateStaff(id);
}


@Patch('reset-password/:id')
resetPassword(
  @Param('id') id: string,
  @Body('newPassword') newPassword: string
) {
  return this.staffService.adminResetPassword(id, newPassword);
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(id, updateStaffDto);
  }

  @Patch(':id/rights-access')
  updateRightsAccess(
    @Param('id') id: string,
    @Body() rightsAccess: any,
  ) {
    return this.staffService.updateRightsAccess(id, rightsAccess);
  }

  @Patch(':id/toggle-status')
  toggleStatus(@Param('id') id: string) {
    return this.staffService.toggleStaffStatus(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }


  @Post('reset-password/request')
  @HttpCode(HttpStatus.OK)
  requestPasswordReset(@Body() body: { email: string }) {
    return this.staffService.generateResetPasswordToken(body.email);
  }

  // @Post('reset-password/confirm')
  // @HttpCode(HttpStatus.OK)
  // resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
  //   return this.staffService.resetPasswordWithToken(resetPasswordDto);
  // }

  @Patch(':id/admin-reset-password')
  adminResetPassword(
    @Param('id') id: string,
    @Body() adminResetPasswordDto: AdminResetPasswordDto,
  ) {
    return this.staffService.adminResetPassword(id, adminResetPasswordDto.newPassword);
  }

  // NEW: Account Suspension APIs
  @Patch(':id/suspend')
  suspendAccount(
    @Param('id') id: string,
    @Body() suspendAccountDto: SuspendAccountDto,
  ) {
    return this.staffService.suspendAccount(id, suspendAccountDto.reason);
  }

  @Patch(':id/reactivate')
  @HttpCode(HttpStatus.OK)
  reactivateAccount(@Param('id') id: string) {
    return this.staffService.reactivateAccount(id);
  }

  @Get('list/suspended')
  getSuspendedStaff() {
    return this.staffService.getSuspendedStaff();
  }

  @Get('list/active')
  getActiveStaff() {
    return this.staffService.getActiveStaff();
  }
}
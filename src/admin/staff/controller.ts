// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { StaffService } from './service';
// import { CreateStaffDto } from './dto/create-staff.dto';
// import { UpdateStaffDto } from './dto/update-staff.dto';

// @Controller('staff')
// export class StaffController {
//   constructor(private readonly staffService: StaffService) {}

//   @Post()
//   create(@Body() createStaffDto: CreateStaffDto) {
//     return this.staffService.create(createStaffDto);
//   }

//   @Get()
//   findAll() {
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

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.staffService.remove(id);
//   }
// }




import { Controller, Post, Get, Param, Body, Put, Delete } from '@nestjs/common';
import { StaffService } from './service';
import { CreateStaffDto, UpdateStaffDto } from './staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  createStaff(@Body() dto: CreateStaffDto) {
    return this.staffService.createStaff(dto);
  }

  @Get()
  getAllStaff() {
    return this.staffService.fetchAllStaff();
  }

  @Get(':id')
  getStaffById(@Param('id') id: string) {
    return this.staffService.fetchStaffById(id);
  }

  @Put(':id')
  updateStaff(@Param('id') id: string, @Body() dto: UpdateStaffDto) {
    return this.staffService.updateStaff(id, dto);
  }

  @Delete(':id')
  deleteStaff(@Param('id') id: string) {
    return this.staffService.deleteStaff(id);
  }
}

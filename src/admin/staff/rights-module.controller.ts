import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RightsModuleService } from './rights-module.service';
import { CreateRightsModuleDto } from './create-rights-module.dto';
import { UpdateRightsModuleDto } from './update-rights-module.dto';

@Controller('rights-modules')
export class RightsModuleController {
  constructor(private readonly rightsModuleService: RightsModuleService) {}

  @Post()
  create(@Body() createRightsModuleDto: CreateRightsModuleDto) {
    return this.rightsModuleService.create(createRightsModuleDto);
  }

  @Get()
  findAll() {
    return this.rightsModuleService.findAll();
  }

  @Get('active')
  findActive() {
    return this.rightsModuleService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rightsModuleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRightsModuleDto: UpdateRightsModuleDto) {
    return this.rightsModuleService.update(id, updateRightsModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rightsModuleService.remove(id);
  }
}
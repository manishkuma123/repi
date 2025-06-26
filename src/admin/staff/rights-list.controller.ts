import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RightsListService } from './rights-list.service';
import { CreateRightsListDto } from './create-rights-list.dto';
import { UpdateRightsListDto } from './update-rights-list.dto';

@Controller('rights-list')
export class RightsListController {
  constructor(private readonly rightsListService: RightsListService) {}

  @Post()
  create(@Body() createRightsListDto: CreateRightsListDto) {
    return this.rightsListService.create(createRightsListDto);
  }

  @Get()
  findAll() {
    return this.rightsListService.findAll();
  }

  @Get('active')
  findActive() {
    return this.rightsListService.findActive();
  }

  @Get('module/:moduleId')
  findByModule(@Param('moduleId') moduleId: string) {
    return this.rightsListService.findByModule(moduleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rightsListService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRightsListDto: UpdateRightsListDto) {
    return this.rightsListService.update(id, updateRightsListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rightsListService.remove(id);
  }
}
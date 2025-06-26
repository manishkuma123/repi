
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RightsModule, RightsModuleDocument } from 'src/entitites/rights-module.entity';
import { CreateRightsModuleDto } from './create-rights-module.dto';
import { UpdateRightsModuleDto } from './update-rights-module.dto';

@Injectable()
export class RightsModuleService {
  constructor(
    @InjectModel(RightsModule.name)
    private rightsModuleModel: Model<RightsModuleDocument>,
  ) {}

  async create(createRightsModuleDto: CreateRightsModuleDto): Promise<RightsModule> {
    const created = new this.rightsModuleModel(createRightsModuleDto);
    return created.save();
  }

  async findAll(): Promise<RightsModule[]> {
    return this.rightsModuleModel
      .find()
      .populate('rightsList')
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

 
  async findOne(id: string): Promise<RightsModule> {
    const rightsModule = await this.rightsModuleModel
      .findById(id)
      .populate('rightsList')
      .exec();

    if (!rightsModule) {
      throw new NotFoundException(`Rights Module with ID ${id} not found`);
    }

    return rightsModule;
  }

  async update(id: string, updateRightsModuleDto: UpdateRightsModuleDto): Promise<RightsModule> {
    const updated = await this.rightsModuleModel
      .findByIdAndUpdate(id, updateRightsModuleDto, { new: true })
      .populate('rightsList')
      .exec();

    if (!updated) {
      throw new NotFoundException(`Rights Module with ID ${id} not found`);
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.rightsModuleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Rights Module with ID ${id} not found`);
    }
  }

  async findActive(): Promise<RightsModule[]> {
    return this.rightsModuleModel
      .find({ isActive: true })
      .populate('rightsList')
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async findByName(name: string): Promise<RightsModule | null> {
    return this.rightsModuleModel.findOne({ name }).exec();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RightsList, RightsListDocument } from 'src/entitites/rights-list.entity';
import { CreateRightsListDto } from './create-rights-list.dto';
import { UpdateRightsListDto } from './update-rights-list.dto';

@Injectable()
export class RightsListService {
  constructor(
    @InjectModel(RightsList.name)
    private rightsListModel: Model<RightsListDocument>,
  ) {}

  async create(createRightsListDto: CreateRightsListDto): Promise<RightsList> {
    const createdRight = new this.rightsListModel(createRightsListDto);
    return (await createdRight.save()).populate('module');
  }

  async findAll(): Promise<RightsList[]> {
    return this.rightsListModel
      .find()
      .populate('module')
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async findByModule(moduleId: string): Promise<RightsList[]> {
    return this.rightsListModel
      .find({ moduleId: new Types.ObjectId(moduleId) })
      .populate('module')
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async findOne(id: string): Promise<RightsList> {
    const rightsList = await this.rightsListModel
      .findById(id)
      .populate('module')
      .exec();

    if (!rightsList) {
      throw new NotFoundException(`Rights List with ID ${id} not found`);
    }

    return rightsList;
  }

  async update(id: string, updateRightsListDto: UpdateRightsListDto): Promise<RightsList> {
    const updatedRight = await this.rightsListModel
      .findByIdAndUpdate(id, updateRightsListDto, { new: true })
      .populate('module')
      .exec();

    if (!updatedRight) {
      throw new NotFoundException(`Rights List with ID ${id} not found`);
    }

    return updatedRight;
  }

  async remove(id: string): Promise<void> {
    const result = await this.rightsListModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Rights List with ID ${id} not found`);
    }
  }

  async findActive(): Promise<RightsList[]> {
    return this.rightsListModel
      .find({ isActive: true })
      .populate('module')
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async findByIds(ids: string[]): Promise<RightsList[]> {
    const objectIds = ids.map(id => new Types.ObjectId(id));
    return this.rightsListModel
      .find({ _id: { $in: objectIds } })
      .populate('module')
      .exec();
  }
}



// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { CreateStaffDto } from './dto/create-staff.dto';
// import { UpdateStaffDto } from './dto/update-staff.dto';

// import { Staff, StaffSchema,StaffDocument  } from 'src/entitites/staff.entity';
// @Injectable()
// export class StaffService {
//   constructor(@InjectModel(Staff.name) private staffModel: Model<StaffDocument>) {}

//   async create(createStaffDto: CreateStaffDto): Promise<Staff> {
//     return this.staffModel.create(createStaffDto);
//   }

//   async findAll(): Promise<Staff[]> {
//     return this.staffModel.find();
//   }

//   async findOne(id: string): Promise<Staff> {
//     const staff = await this.staffModel.findById(id);
//     if (!staff) throw new NotFoundException('Staff not found');
//     return staff;
//   }

//   async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
//     const updated = await this.staffModel.findByIdAndUpdate(id, updateStaffDto, { new: true });
//     if (!updated) throw new NotFoundException('Staff not found');
//     return updated;
//   }

//   async remove(id: string): Promise<void> {
//     const result = await this.staffModel.findByIdAndDelete(id);
//     if (!result) throw new NotFoundException('Staff not found');
//   }
// }
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/entitites/user';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { eAPIResultStatus, Role } from 'src/utils/enum';
import { CreateStaffDto, UpdateStaffDto } from './staff.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}


  async createStaff(dto: CreateStaffDto): Promise<ResponseDTO> {
    try {
      const staff = new this.userModel({ ...dto, role: Role.Staff });
      await staff.save();

      return {
        status: eAPIResultStatus.Success,
        message: 'Staff created successfully',
        data: staff,
      };
    } catch (error) {
      console.error('createStaff error:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Failed to create staff',
      };
    }
  }

  
  async fetchAllStaff(): Promise<ResponseDTO> {
    try {
      const staffList = await this.userModel.find({ role: Role.Staff });
      return {
        status: eAPIResultStatus.Success,
        message: 'Staff fetched successfully',
        data: staffList,
      };
    } catch (error) {
      console.error('fetchAllStaff error:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Failed to fetch staff',
      };
    }
  }

  async fetchStaffById(staffId: string): Promise<ResponseDTO> {
    try {
      const staff = await this.userModel.findOne({
        _id: staffId,
        role: Role.Staff,
      });

      if (!staff) {
        return {
          status: eAPIResultStatus.Failure,
          message: 'Staff not found',
        };
      }

      return {
        status: eAPIResultStatus.Success,
        message: 'Staff fetched successfully',
        data: staff,
      };
    } catch (error) {
      console.error('fetchStaffById error:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Failed to fetch staff',
      };
    }
  }


  async updateStaff(staffId: string, dto: UpdateStaffDto): Promise<ResponseDTO> {
    try {
      const staff = await this.userModel.findOneAndUpdate(
        { _id: staffId, role: Role.Staff },
        dto,
        { new: true },
      );

      if (!staff) {
        return {
          status: eAPIResultStatus.Failure,
          message: 'Staff not found or update failed',
        };
      }

      return {
        status: eAPIResultStatus.Success,
        message: 'Staff updated successfully',
        data: staff,
      };
    } catch (error) {
      console.error('updateStaff error:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Failed to update staff',
      };
    }
  }

  // DELETE STAFF
  async deleteStaff(staffId: string): Promise<ResponseDTO> {
    try {
      const result = await this.userModel.findOneAndDelete({
        _id: staffId,
        role: Role.Staff,
      });

      if (!result) {
        return {
          status: eAPIResultStatus.Failure,
          message: 'Staff not found or delete failed',
        };
      }

      return {
        status: eAPIResultStatus.Success,
        message: 'Staff deleted successfully',
      };
    } catch (error) {
      console.error('deleteStaff error:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Failed to delete staff',
      };
    }
  }
}

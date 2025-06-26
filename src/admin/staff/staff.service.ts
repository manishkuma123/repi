// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Staff, StaffDocument } from 'src/entitites/staff.schema';
// import { CreateStaffDto } from './dto/create-staff.dto';
// import { UpdateStaffDto } from './dto/update-staff.dto';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class StaffService {
//   constructor(
//     @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
//   ) {}

//   async create(createStaffDto: CreateStaffDto): Promise<Staff> {
//     try {
    
//       const existingStaff = await this.staffModel.findOne({ 
//         email: createStaffDto.email 
//       });
      
//       if (existingStaff) {
//         throw new BadRequestException('Staff with this email already exists');
//       }

//       // Hash password
//       const saltRounds = 10;
//       const hashedPassword = await bcrypt.hash(createStaffDto.password, saltRounds);

//       // Set default rights access based on role
//       let defaultRightsAccess = {};
      
//       if (createStaffDto.role === 'admin') {
//         defaultRightsAccess = {
//           modules: {
//             spotlight: {
//               userManagement: true,
//               dashboardInsight: true,
//               reviewManagement: true,
//               jobManagement: true,
//               packageView: true,
//             },
//             contractor: {
//               userManagement: true,
//               generalBoards: true,
//               serviceBoards: true,
//               jobManagement: true,
//             },
//             reviewManagement: {
//               homeScreen: true,
//               contractor: true,
//               customerServiceReportComplaint: true,
//               ban: true,
//             },
//             mkt: {
//               bannerCreate: true,
//               promoCode: true,
//             },
//             userManagement: {
//               homeScreen: true,
//               wallet: true,
//               kyc: true,
//             },
//             jobManagement: {
//               serviceCreator: true,
//               serviceCreating: true,
//               serviceCompleted: true,
//               serviceScheduled: true,
//             },
//             dashboard: {
//               status: true,
//               revenue: true,
//               downloadReporting: true,
//               downloadReports: true,
//               clock: true,
//             },
//             labourManagement: {
//               labourManagement: true,
//             },
//             customerServiceCenter: {
//               customerServiceCenter: true,
//             },
//             incomeManagement: {
//               platformFee: true,
//               feeManagement: true,
//               paymentReports: true,
//               orderList: true,
//             },
//           },
//           permissions: {
//             canCreate: true,
//             canRead: true,
//             canUpdate: true,
//             canDelete: true,
//             canApprove: true,
//             canReject: true,
//           }
//         };
//       } else {
//         // Default staff permissions (limited)
//         defaultRightsAccess = {
//           modules: {
//             spotlight: {
//               userManagement: false,
//               dashboardInsight: false,
//               reviewManagement: false,
//               jobManagement: false,
//               packageView: false,
//             },
//             contractor: {
//               userManagement: false,
//               generalBoards: false,
//               serviceBoards: false,
//               jobManagement: false,
//             },
//             reviewManagement: {
//               homeScreen: false,
//               contractor: false,
//               customerServiceReportComplaint: false,
//               ban: false,
//             },
//             mkt: {
//               bannerCreate: false,
//               promoCode: false,
//             },
//             userManagement: {
//               homeScreen: false,
//               wallet: false,
//               kyc: false,
//             },
//             jobManagement: {
//               serviceCreator: false,
//               serviceCreating: false,
//               serviceCompleted: false,
//               serviceScheduled: false,
//             },
//             dashboard: {
//               status: true,
//               revenue: false,
//               downloadReporting: false,
//               downloadReports: false,
//               clock: true,
//             },
//             labourManagement: {
//               labourManagement: false,
//             },
//             customerServiceCenter: {
//               customerServiceCenter: false,
//             },
//             incomeManagement: {
//               platformFee: false,
//               feeManagement: false,
//               paymentReports: false,
//               orderList: false,
//             },
//           },
//           permissions: {
//             canCreate: false,
//             canRead: true,
//             canUpdate: false,
//             canDelete: false,
//             canApprove: false,
//             canReject: false,
//           }
//         };
//       }

//       const staffData = {
//         ...createStaffDto,
//         password: hashedPassword,
//         rightsAccess: createStaffDto.rightsAccess || defaultRightsAccess,
//       };

//       const createdStaff = new this.staffModel(staffData);
//       const savedStaff = await createdStaff.save();
  
//       const { password, ...result } = savedStaff.toObject();
//       return result;
//     } catch (error) {
//       if (error instanceof BadRequestException) {
//         throw error;
//       }
//       throw new BadRequestException('Failed to create staff');
//     }
//   }

//   async findAll(): Promise<Staff[]> {
//     return this.staffModel
//       .find()
//       .select('-password')
//       .sort({ createdAt: -1 })
//       .exec();
//   }

//   async findOne(id: string): Promise<Staff> {
//     const staff = await this.staffModel
//       .findById(id)
//       .select('-password')
//       .exec();
      
//     if (!staff) {
//       throw new NotFoundException('Staff not found');
//     }
    
//     return staff;
//   }

//   async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
//     try {
//       // If password is being updated, hash it
//       if (updateStaffDto.password) {
//         const saltRounds = 10;
//         updateStaffDto.password = await bcrypt.hash(updateStaffDto.password, saltRounds);
//       }

//       const updatedStaff = await this.staffModel
//         .findByIdAndUpdate(id, updateStaffDto, { new: true })
//         .select('-password')
//         .exec();
        
//       if (!updatedStaff) {
//         throw new NotFoundException('Staff not found');
//       }
      
//       return updatedStaff;
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       throw new BadRequestException('Failed to update staff');
//     }
//   }

//   async updateRightsAccess(id: string, rightsAccess: any): Promise<Staff> {
//     try {
//       const updatedStaff = await this.staffModel
//         .findByIdAndUpdate(
//           id, 
//           { rightsAccess }, 
//           { new: true }
//         )
//         .select('-password')
//         .exec();
        
//       if (!updatedStaff) {
//         throw new NotFoundException('Staff not found');
//       }
      
//       return updatedStaff;
//     } catch (error) {
//       throw new BadRequestException('Failed to update staff rights access');
//     }
//   }

//   async remove(id: string): Promise<{ message: string }> {
//     const result = await this.staffModel.findByIdAndDelete(id).exec();
    
//     if (!result) {
//       throw new NotFoundException('Staff not found');
//     }
    
//     return { message: 'Staff deleted successfully' };
//   }

//   async toggleStaffStatus(id: string): Promise<Staff> {
//     const staff = await this.staffModel.findById(id).exec();
    
//     if (!staff) {
//       throw new NotFoundException('Staff not found');
//     }
    
//     const updatedStaff = await this.staffModel
//       .findByIdAndUpdate(
//         id, 
//         { isActive: !staff.isActive }, 
//         { new: true }
//       )
//       .select('-password')
//       .exec();
      
//     return updatedStaff;
//   }

//   async getStaffByRole(role: string): Promise<Staff[]> {
//     return this.staffModel
//       .find({ role })
//       .select('-password')
//       .sort({ createdAt: -1 })
//       .exec();
//   }
// }
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Staff, StaffDocument } from 'src/entitites/staff.schema';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
  ) {}

  async create(createStaffDto: CreateStaffDto): Promise<Staff> {
    try {
    
      const existingStaff = await this.staffModel.findOne({ 
        email: createStaffDto.email 
      });
      
      if (existingStaff) {
        throw new BadRequestException('Staff with this email already exists');
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createStaffDto.password, saltRounds);

      // Set default rights access based on role
      let defaultRightsAccess = {};
      
      if (createStaffDto.role === 'admin') {
        defaultRightsAccess = {
          modules: {
            spotlight: {
              userManagement: true,
              dashboardInsight: true,
              reviewManagement: true,
              jobManagement: true,
              packageView: true,
            },
            contractor: {
              userManagement: true,
              generalBoards: true,
              serviceBoards: true,
              jobManagement: true,
            },
            reviewManagement: {
              homeScreen: true,
              contractor: true,
              customerServiceReportComplaint: true,
              ban: true,
            },
            mkt: {
              bannerCreate: true,
              promoCode: true,
            },
            userManagement: {
              homeScreen: true,
              wallet: true,
              kyc: true,
            },
            jobManagement: {
              serviceCreator: true,
              serviceCreating: true,
              serviceCompleted: true,
              serviceScheduled: true,
            },
            dashboard: {
              status: true,
              revenue: true,
              downloadReporting: true,
              downloadReports: true,
              clock: true,
            },
            labourManagement: {
              labourManagement: true,
            },
            customerServiceCenter: {
              customerServiceCenter: true,
            },
            incomeManagement: {
              platformFee: true,
              feeManagement: true,
              paymentReports: true,
              orderList: true,
            },
          },
          permissions: {
            canCreate: true,
            canRead: true,
            canUpdate: true,
            canDelete: true,
            canApprove: true,
            canReject: true,
          }
        };
      } else {
        // Default staff permissions (limited)
        defaultRightsAccess = {
          modules: {
            spotlight: {
              userManagement: false,
              dashboardInsight: false,
              reviewManagement: false,
              jobManagement: false,
              packageView: false,
            },
            contractor: {
              userManagement: false,
              generalBoards: false,
              serviceBoards: false,
              jobManagement: false,
            },
            reviewManagement: {
              homeScreen: false,
              contractor: false,
              customerServiceReportComplaint: false,
              ban: false,
            },
            mkt: {
              bannerCreate: false,
              promoCode: false,
            },
            userManagement: {
              homeScreen: false,
              wallet: false,
              kyc: false,
            },
            jobManagement: {
              serviceCreator: false,
              serviceCreating: false,
              serviceCompleted: false,
              serviceScheduled: false,
            },
            dashboard: {
              status: true,
              revenue: false,
              downloadReporting: false,
              downloadReports: false,
              clock: true,
            },
            labourManagement: {
              labourManagement: false,
            },
            customerServiceCenter: {
              customerServiceCenter: false,
            },
            incomeManagement: {
              platformFee: false,
              feeManagement: false,
              paymentReports: false,
              orderList: false,
            },
          },
          permissions: {
            canCreate: false,
            canRead: true,
            canUpdate: false,
            canDelete: false,
            canApprove: false,
            canReject: false,
          }
        };
      }

      const staffData = {
        ...createStaffDto,
        password: hashedPassword,
        rightsAccess: createStaffDto.rightsAccess || defaultRightsAccess,
      };

      const createdStaff = new this.staffModel(staffData);
      const savedStaff = await createdStaff.save();
  
      const { password, ...result } = savedStaff.toObject();
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create staff');
    }
  }
 async findAll(): Promise<any[]> {
    const staffList = await this.staffModel
      .find()
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .exec();

    // Add suspension status to each staff member
    return staffList.map(staff => {
      const staffData = staff.toObject();
      return {
        ...staffData,
        accountStatus: staff.isActive ? 'active' : 'suspended',
        isSuspended: !staff.isActive,
        suspensionInfo: !staff.isActive ? {
          suspendedAt: staff.suspendedAt,
          suspensionReason: staff.suspensionReason,
          daysSinceSuspension: staff.suspendedAt ? 
            Math.floor((new Date().getTime() - staff.suspendedAt.getTime()) / (1000 * 60 * 60 * 24)) : 0
        } : null,
        canLogin: staff.isActive && (!staff.accountLockedUntil || staff.accountLockedUntil < new Date()),
        hasFailedLogins: (staff.failedLoginAttempts || 0) > 0,
        isLocked: staff.accountLockedUntil && staff.accountLockedUntil > new Date(),
      };
    });
  }

   async findOne(id: string): Promise<any> {
    const staff = await this.staffModel
      .findById(id)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .exec();
      
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }
    
    const staffData = staff.toObject();
    return {
      ...staffData,
      accountStatus: staff.isActive ? 'active' : 'suspended',
      isSuspended: !staff.isActive,
      suspensionInfo: !staff.isActive ? {
        suspendedAt: staff.suspendedAt,
        suspensionReason: staff.suspensionReason,
        daysSinceSuspension: staff.suspendedAt ? 
          Math.floor((new Date().getTime() - staff.suspendedAt.getTime()) / (1000 * 60 * 60 * 24)) : 0
      } : null,
      canLogin: staff.isActive && (!staff.accountLockedUntil || staff.accountLockedUntil < new Date()),
      hasFailedLogins: (staff.failedLoginAttempts || 0) > 0,
      isLocked: staff.accountLockedUntil && staff.accountLockedUntil > new Date(),
      reactivationInfo: staff.reactivatedAt ? {
        reactivatedAt: staff.reactivatedAt,
        daysSinceReactivation: Math.floor((new Date().getTime() - staff.reactivatedAt.getTime()) / (1000 * 60 * 60 * 24))
      } : null
    };
  }
 
  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
    try {
      // If password is being updated, hash it
      if (updateStaffDto.password) {
        const saltRounds = 10;
        updateStaffDto.password = await bcrypt.hash(updateStaffDto.password, saltRounds);
      }

      const updatedStaff = await this.staffModel
        .findByIdAndUpdate(id, updateStaffDto, { new: true })
        .select('-password -resetPasswordToken -resetPasswordExpires')
        .exec();
        
      if (!updatedStaff) {
        throw new NotFoundException('Staff not found');
      }
      
      return updatedStaff;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update staff');
    }
  }

  async updateRightsAccess(id: string, rightsAccess: any): Promise<Staff> {
    try {
      const updatedStaff = await this.staffModel
        .findByIdAndUpdate(
          id, 
          { rightsAccess }, 
          { new: true }
        )
        .select('-password -resetPasswordToken -resetPasswordExpires')
        .exec();
        
      if (!updatedStaff) {
        throw new NotFoundException('Staff not found');
      }
      
      return updatedStaff;
    } catch (error) {
      throw new BadRequestException('Failed to update staff rights access');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.staffModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException('Staff not found');
    }
    
    return { message: 'Staff deleted successfully' };
  }

  async toggleStaffStatus(id: string): Promise<Staff> {
    const staff = await this.staffModel.findById(id).exec();
    
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }
    
    const updatedStaff = await this.staffModel
      .findByIdAndUpdate(
        id, 
        { isActive: !staff.isActive }, 
        { new: true }
      )
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .exec();
      
    return updatedStaff;
  }

  async getStaffByRole(role: string): Promise<Staff[]> {
    return this.staffModel
      .find({ role })
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .exec();
  }

  // NEW: Reset Password Functionality
  async generateResetPasswordToken(email: string): Promise<{ message: string; token?: string }> {
    try {
      const staff = await this.staffModel.findOne({ email }).exec();
      
      if (!staff) {
        throw new NotFoundException('Staff with this email not found');
      }

      // Check if staff is active
      if (!staff.isActive) {
        throw new BadRequestException('Account is suspended. Please contact administrator');
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Save reset token to database
      await this.staffModel.findByIdAndUpdate(staff._id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry,
      }).exec();

      // In production, you would send this token via email
      // For now, we'll return it in the response (remove this in production)
      return {
        message: 'Password reset token generated successfully. Check your email for reset instructions.',
        token: resetToken, // Remove this line in production
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to generate reset password token');
    }
  }

  async resetPasswordWithToken(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    try {
      const { token, newPassword } = resetPasswordDto;

      // Find staff with valid reset token
      const staff = await this.staffModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }, // Token not expired
      }).exec();

      if (!staff) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      // Hash new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear reset token
      await this.staffModel.findByIdAndUpdate(staff._id, {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      }).exec();

      return { message: 'Password reset successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to reset password');
    }
  }

  // async adminResetPassword(id: string, newPassword: string): Promise<{ message: string }> {
  //   try {
  //     const staff = await this.staffModel.findById(id).exec();
      
  //     if (!staff) {
  //       throw new NotFoundException('Staff not found');
  //     }

  //     // Hash new password
  //     const saltRounds = 10;
  //     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  //     // Update password and clear any existing reset tokens
  //     await this.staffModel.findByIdAndUpdate(id, {
  //       password: hashedPassword,
  //       resetPasswordToken: undefined,
  //       resetPasswordExpires: undefined,
  //     }).exec();

  //     return { message: 'Password reset successfully by administrator' };
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new BadRequestException('Failed to reset password');
  //   }
  // }

  // NEW: Suspend Account Functionality
  async suspendAccount(id: string, reason?: string): Promise<Staff> {
    try {
      const staff = await this.staffModel.findById(id).exec();
      
      if (!staff) {
        throw new NotFoundException('Staff not found');
      }

      if (!staff.isActive) {
        throw new BadRequestException('Account is already suspended');
      }

      const updatedStaff = await this.staffModel
        .findByIdAndUpdate(
          id,
          {
            isActive: false,
            suspendedAt: new Date(),
            suspensionReason: reason || 'Suspended by administrator',
            // Clear any active reset tokens when suspending
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined,
          },
          { new: true }
        )
        .select('-password -resetPasswordToken -resetPasswordExpires')
        .exec();

      return updatedStaff;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to suspend account');
    }
  }

  async reactivateAccount(id: string): Promise<Staff> {
    try {
      const staff = await this.staffModel.findById(id).exec();
      
      if (!staff) {
        throw new NotFoundException('Staff not found');
      }

      if (staff.isActive) {
        throw new BadRequestException('Account is already active');
      }

      const updatedStaff = await this.staffModel
        .findByIdAndUpdate(
          id,
          {
            isActive: true,
            suspendedAt: undefined,
            suspensionReason: undefined,
            reactivatedAt: new Date(),
          },
          { new: true }
        )
        .select('-password -resetPasswordToken -resetPasswordExpires')
        .exec();

      return updatedStaff;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to reactivate account');
    }
  }

  async getSuspendedStaff(): Promise<Staff[]> {
    return this.staffModel
      .find({ isActive: false })
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ suspendedAt: -1 })
      .exec();
  }

  async getActiveStaff(): Promise<Staff[]> {
    return this.staffModel
      .find({ isActive: true })
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .exec();
  }





  async suspendStaff(staffId: string, reason: string): Promise<Staff> {
  const staff = await this.staffModel.findById(staffId);
  if (!staff) {
    throw new NotFoundException('Staff not found');
  }

  staff.isActive = false;
  staff.suspendedAt = new Date();
  staff.suspensionReason = reason;

  return await staff.save();
}

async activateStaff(staffId: string): Promise<Staff> {
  const staff = await this.staffModel.findById(staffId);
  if (!staff) {
    throw new NotFoundException('Staff not found');
  }

  staff.isActive = true;
  staff.suspendedAt = null;
  staff.suspensionReason = null;

  return await staff.save();
}




async adminResetPassword(staffId: string, newPassword: string): Promise<string> {
  const staff = await this.staffModel.findById(staffId);
  if (!staff) {
    throw new NotFoundException('Staff not found');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  staff.password = hashedPassword;
  await staff.save();

  return 'Password reset successfully';
}
}
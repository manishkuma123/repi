// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type StaffDocument = Staff & Document;

// export enum UserStatus {
//   ACTIVE = 'active',
//   INACTIVE = 'inactive',
// }
// @Schema({ timestamps: true })
// export class Staff {
//   @Prop({ required: true })
//   phone_no: string;

//   @Prop()
//   email?: string;

//   @Prop()
//   password?: string;

//   @Prop()
//   full_name?: string;

//   @Prop()
//   first_name?: string;

//   @Prop()
//   last_name?: string;

//   @Prop({ default: 'staff' })
//   role: string;

//   @Prop({ default: false })
//   isVerified?: boolean;

//   @Prop({ default: Date.now })
//   registered_date?: Date;

//   @Prop()
//   profile_url?: string;

//   @Prop({ default: true })
//   isActive?: boolean;

  
// @Prop({ type: String, enum: ['active', 'inactive'], default: 'active' })
// status: UserStatus;

//   @Prop()
//   address?: string;

//   @Prop()
//   address2?: string;

//   @Prop()
//   province?: string;

//   @Prop()
//   district?: string;

//   @Prop()
//   sub_district?: string;

//   @Prop()
//   zip?: string;

//   @Prop()
//   position?: string;

//   @Prop()
//   last_order_job?: string;

//   @Prop()
//   corporate_id?: string;

//   @Prop({ default: false })
//   push_notification_enabled?: boolean;
// }

// export const StaffSchema = SchemaFactory.createForClass(Staff);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StaffDocument = Staff & Document;

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class Staff {
  @Prop({ required: true })
  phone_no: string;

  @Prop()
  email?: string;

  @Prop()
  password?: string;

  @Prop()
  full_name?: string;

  @Prop()
  first_name?: string;

  @Prop()
  last_name?: string;

  @Prop({ default: 'staff' })
  role: string;

  @Prop({ default: false })
  isVerified?: boolean;

  @Prop({ default: Date.now })
  registered_date?: Date;

  @Prop()
  profile_url?: string;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ type: String, enum: ['active', 'inactive'], default: 'active' })
  status: UserStatus;

  @Prop()
  address?: string;

  @Prop()
  address2?: string;

  @Prop()
  province?: string;

  @Prop()
  district?: string;

  @Prop()
  sub_district?: string;

  @Prop()
  zip?: string;

  @Prop()
  position?: string;

  @Prop()
  last_order_job?: string;

  @Prop()
  corporate_id?: string;

  @Prop({ default: false })
  push_notification_enabled?: boolean;

  // NEW: Password Management Fields
  @Prop()
  passwordResetAt?: Date;

  @Prop()
  passwordResetBy?: string;

  @Prop()
  passwordChangedAt?: Date;

  // NEW: Account Suspension Fields
  @Prop({ default: false })
  isSuspended?: boolean;

  @Prop()
  suspensionReason?: string;

  @Prop()
  suspendedAt?: Date;

  @Prop()
  suspendedBy?: string;

  @Prop()
  suspendedUntil?: Date; // Optional: for temporary suspensions

  @Prop()
  unsuspendedAt?: Date;

  @Prop()
  unsuspendedBy?: string;

  // NEW: Rights Access Field (for role-based permissions)
  @Prop({ 
    type: {
      modules: {
        spotlight: {
          userManagement: { type: Boolean, default: false },
          dashboardInsight: { type: Boolean, default: false },
          reviewManagement: { type: Boolean, default: false },
          jobManagement: { type: Boolean, default: false },
          packageView: { type: Boolean, default: false },
        },
        contractor: {
          userManagement: { type: Boolean, default: false },
          generalBoards: { type: Boolean, default: false },
          serviceBoards: { type: Boolean, default: false },
          jobManagement: { type: Boolean, default: false },
        },
        reviewManagement: {
          homeScreen: { type: Boolean, default: false },
          contractor: { type: Boolean, default: false },
          customerServiceReportComplaint: { type: Boolean, default: false },
          ban: { type: Boolean, default: false },
        },
        mkt: {
          bannerCreate: { type: Boolean, default: false },
          promoCode: { type: Boolean, default: false },
        },
        userManagement: {
          homeScreen: { type: Boolean, default: false },
          wallet: { type: Boolean, default: false },
          kyc: { type: Boolean, default: false },
        },
        jobManagement: {
          serviceCreator: { type: Boolean, default: false },
          serviceCreating: { type: Boolean, default: false },
          serviceCompleted: { type: Boolean, default: false },
          serviceScheduled: { type: Boolean, default: false },
        },
        dashboard: {
          status: { type: Boolean, default: false },
          revenue: { type: Boolean, default: false },
          downloadReporting: { type: Boolean, default: false },
          downloadReports: { type: Boolean, default: false },
          clock: { type: Boolean, default: false },
        },
        labourManagement: {
          labourManagement: { type: Boolean, default: false },
        },
        customerServiceCenter: {
          customerServiceCenter: { type: Boolean, default: false },
        },
        incomeManagement: {
          platformFee: { type: Boolean, default: false },
          feeManagement: { type: Boolean, default: false },
          paymentReports: { type: Boolean, default: false },
          orderList: { type: Boolean, default: false },
        },
      },
      permissions: {
        canCreate: { type: Boolean, default: false },
        canRead: { type: Boolean, default: true },
        canUpdate: { type: Boolean, default: false },
        canDelete: { type: Boolean, default: false },
        canApprove: { type: Boolean, default: false },
        canReject: { type: Boolean, default: false },
      }
    },
    default: {}
  })
  rightsAccess?: {
    modules: {
      spotlight: {
        userManagement: boolean;
        dashboardInsight: boolean;
        reviewManagement: boolean;
        jobManagement: boolean;
        packageView: boolean;
      };
      contractor: {
        userManagement: boolean;
        generalBoards: boolean;
        serviceBoards: boolean;
        jobManagement: boolean;
      };
      reviewManagement: {
        homeScreen: boolean;
        contractor: boolean;
        customerServiceReportComplaint: boolean;
        ban: boolean;
      };
      mkt: {
        bannerCreate: boolean;
        promoCode: boolean;
      };
      userManagement: {
        homeScreen: boolean;
        wallet: boolean;
        kyc: boolean;
      };
      jobManagement: {
        serviceCreator: boolean;
        serviceCreating: boolean;
        serviceCompleted: boolean;
        serviceScheduled: boolean;
      };
      dashboard: {
        status: boolean;
        revenue: boolean;
        downloadReporting: boolean;
        downloadReports: boolean;
        clock: boolean;
      };
      labourManagement: {
        labourManagement: boolean;
      };
      customerServiceCenter: {
        customerServiceCenter: boolean;
      };
      incomeManagement: {
        platformFee: boolean;
        feeManagement: boolean;
        paymentReports: boolean;
        orderList: boolean;
      };
    };
    permissions: {
      canCreate: boolean;
      canRead: boolean;
      canUpdate: boolean;
      canDelete: boolean;
      canApprove: boolean;
      canReject: boolean;
    };
  };
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type StaffDocument = Staff & Document;

// @Schema({ timestamps: true })
// export class Staff {
//   @Prop({ required: true })
//   name: string;

//   @Prop({ required: true })
//   familyName: string;
//  @Prop()
//  position :string;
//   @Prop({ required: true, unique: true })
//   email: string;

// //   @Prop({ required: true })
// //   password: string;
// @Prop({ required: false })
// password?: string;
//   @Prop()
//   address: string;

//   @Prop()
//   phone: string;

//   @Prop({ required: true, enum: ['admin', 'staff'], default: 'staff' })
//   role: string;

//   @Prop({ type: Object, default: {} })
//   rightsAccess: {
//     modules?: {
//       spotlight?: {
//         userManagement?: boolean;
//         dashboardInsight?: boolean;
//         reviewManagement?: boolean;
//         jobManagement?: boolean;
//         packageView?: boolean;
//       };
//       contractor?: {
//         userManagement?: boolean;
//         generalBoards?: boolean;
//         serviceBoards?: boolean;
//         jobManagement?: boolean;
//       };
//       reviewManagement?: {
//         homeScreen?: boolean;
//         contractor?: boolean;
//         customerServiceReportComplaint?: boolean;
//         ban?: boolean;
//       };
//       mkt?: {
//         bannerCreate?: boolean;
//         promoCode?: boolean;
//       };
//       userManagement?: {
//         homeScreen?: boolean;
//         wallet?: boolean;
//         kyc?: boolean;
//       };
//       jobManagement?: {
//         serviceCreator?: boolean;
//         serviceCreating?: boolean;
//         serviceCompleted?: boolean;
//         serviceScheduled?: boolean;
//       };
//       dashboard?: {
//         status?: boolean;
//         revenue?: boolean;
//         downloadReporting?: boolean;
//         downloadReports?: boolean;
//         clock?: boolean;
//       };
//       labourManagement?: {
//         labourManagement?: boolean;
//       };
//       customerServiceCenter?: {
//         customerServiceCenter?: boolean;
//       };
//       incomeManagement?: {
//         platformFee?: boolean;
//         feeManagement?: boolean;
//         paymentReports?: boolean;
//         orderList?: boolean;
//       };
//     };
//     permissions?: {
//       canCreate?: boolean;
//       canRead?: boolean;
//       canUpdate?: boolean;
//       canDelete?: boolean;
//       canApprove?: boolean;
//       canReject?: boolean;
//     };
//   };

//   @Prop({ default: true })
//   isActive: boolean;
// }

// export const StaffSchema = SchemaFactory.createForClass(Staff);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StaffDocument = Staff & Document;

@Schema({ timestamps: true })
export class Staff {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  familyName: string;

  @Prop()
  position: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop()
  address: string;

  @Prop()
  phone: string;

  @Prop({ required: true, enum: ['admin', 'staff'], default: 'staff' })
  role: string;

@Prop()
  profile_url?: string;
  @Prop({ type: Object, default: {} })
  rightsAccess: {
    modules?: {
      spotlight?: {
        userManagement?: boolean;
        dashboardInsight?: boolean;
        reviewManagement?: boolean;
        jobManagement?: boolean;
        packageView?: boolean;
      };
      contractor?: {
        userManagement?: boolean;
        generalBoards?: boolean;
        serviceBoards?: boolean;
        jobManagement?: boolean;
      };
      reviewManagement?: {
        homeScreen?: boolean;
        contractor?: boolean;
        customerServiceReportComplaint?: boolean;
        ban?: boolean;
      };
      mkt?: {
        bannerCreate?: boolean;
        promoCode?: boolean;
      };
      userManagement?: {
        homeScreen?: boolean;
        wallet?: boolean;
        kyc?: boolean;
      };
      jobManagement?: {
        serviceCreator?: boolean;
        serviceCreating?: boolean;
        serviceCompleted?: boolean;
        serviceScheduled?: boolean;
      };
      dashboard?: {
        status?: boolean;
        revenue?: boolean;
        downloadReporting?: boolean;
        downloadReports?: boolean;
        clock?: boolean;
      };
      labourManagement?: {
        labourManagement?: boolean;
      };
      customerServiceCenter?: {
        customerServiceCenter?: boolean;
      };
      incomeManagement?: {
        platformFee?: boolean;
        feeManagement?: boolean;
        paymentReports?: boolean;
        orderList?: boolean;
      };
    };
    permissions?: {
      canCreate?: boolean;
      canRead?: boolean;
      canUpdate?: boolean;
      canDelete?: boolean;
      canApprove?: boolean;
      canReject?: boolean;
    };
  };

  @Prop({ default: true })
  isActive: boolean;

  // NEW: Password Reset Fields
  @Prop({ required: false })
  resetPasswordToken?: string;

  @Prop({ required: false })
  resetPasswordExpires?: Date;

  // NEW: Account Suspension Fields
  @Prop({ required: false })
  suspendedAt?: Date;

  @Prop({ required: false })
  suspensionReason?: string;

  @Prop({ required: false })
  reactivatedAt?: Date;

  // NEW: Last Login Tracking (optional)
  @Prop({ required: false })
  lastLoginAt?: Date;

  // NEW: Failed Login Attempts (for security)
  @Prop({ default: 0 })
  failedLoginAttempts?: number;

  @Prop({ required: false })
  accountLockedUntil?: Date;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
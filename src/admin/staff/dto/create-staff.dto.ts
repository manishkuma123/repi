import { IsEmail, IsNotEmpty, IsOptional, IsString, IsObject, IsEnum } from 'class-validator';

export class CreateStaffDto {
  @IsNotEmpty()
  @IsString()
  name: string;
 
@IsOptional()
@IsString()
profile_url?: string;
  @IsNotEmpty()
  @IsString()
  familyName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;
 @IsOptional()
  @IsString()
  position?: string;
  @IsEnum(['admin', 'staff'])
  role: string;

  @IsOptional()
  @IsObject()
  rightsAccess?: {
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
}

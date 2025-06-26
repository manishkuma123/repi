

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { ResponseDTO } from 'src/dtos/general-response/general-response';
// import { User, UserDocument } from 'src/entitites/user';
// import { CertificatesService } from 'src/helper-modules/certificates/certificates.service';
// import { SkilHelperService } from 'src/helper-modules/expertise-helper/skill-helper.service';
// import { GeoLocationService } from 'src/helper-modules/geo-location/geo-location.service';
// import { ScheduledJobService } from 'src/modules/scheduled-job/scheduled-job.service';
// import { eAPIResultStatus, Role } from 'src/utils/enum';



// @Injectable()
// export class HelperService {
//   constructor(
//     @InjectModel(User.name)
//     private userModel: Model<UserDocument>,
//     private readonly helperLocationService: GeoLocationService,
//     private readonly helperCertificateService: CertificatesService,
//     private readonly helperSkillService: SkilHelperService,
//     private readonly scheduleJobService: ScheduledJobService,
//   ) {}

 

  

//   async fetchAllHelpers(): Promise<ResponseDTO> {
//     try {
//       const data = await this.userModel
//         .find({ role: Role.Helper })
//         .populate({ path: 'last_order_id', select: 'order_number ' });

//       return { status: eAPIResultStatus.Success, data };
//     } catch (error) {
//       return { status: eAPIResultStatus.Failure };
//     }
//   }

//   async fetchHelperProfileById(helperId: string): Promise<ResponseDTO> {
//     try {
//       const helper = await this.userModel.findById(helperId).lean();
//       const location = await this.helperLocationService.getHelperLocation(helperId);
//       const certificates =
//         await this.helperCertificateService.getAllAcceptedCertificatesByHelperId(helperId);
//       const skills =
//         await this.helperSkillService.getAllSkillNameByHelperId(helperId);
//       const orders = await this.scheduleJobService.getOrderByHelperId(helperId);
//       const { successJobCount, failJobCount } =
//         await this.scheduleJobService.getJobCountsForCurrentYear(helperId);

//       return {
//         status: eAPIResultStatus.Success,
//         data: {
//           ...helper,
//           location,
//           certificates,
//           skills,
//           orders,
//           successJobCount,
//           failJobCount,
//         },
//       };
//     } catch (error) {
//       return { status: eAPIResultStatus.Failure };
//     }
//   }

//   async fetchOrderDetails(orderId: string): Promise<ResponseDTO> {
//     try {
//       const data = await this.scheduleJobService.getOrderDetailsById(orderId);
//       return { status: eAPIResultStatus.Success, data };
//     } catch (error) {
//       return { status: eAPIResultStatus.Failure };
//     }
//   }



// async fetchActiveHelpers(): Promise<ResponseDTO> {
//   try {
//     const data = await this.userModel
//       .find({ role: Role.Helper, isActive: true }) // ✅ corrected field name
//       .select('name email phone_no'); // ✅ corrected to match your schema field name

//     return {
//       status: eAPIResultStatus.Success,
//       message: 'Active helpers fetched successfully',
//       data,
//     };
//   } catch (error) {
//     return {
//       status: eAPIResultStatus.Failure,
//       message: 'Failed to fetch active helpers',
//       data: error.message,
//     };
//   }
// }

// async searchHelpers(keyword: string): Promise<ResponseDTO> {
//   try {
//     const regex = new RegExp(keyword, 'i');
//     const data = await this.userModel.find({
//       role: Role.Helper,
//       $or: [{ name: regex }, { email: regex }],
//     });

//     return {
//       status: eAPIResultStatus.Success,
//       message: 'Helpers search results',
//       data,
//     };
//   } catch (error) {
//     return {
//       status: eAPIResultStatus.Failure,
//       message: 'Search failed',
//       data: error.message,
//     };
//   }
// }








// }
// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { ResponseDTO } from 'src/dtos/general-response/general-response';
// import { User, UserDocument } from 'src/entitites/user';
// import { ScheduledJob, ScheduledJobDocument } from 'src/entitites/scheduled-job';
// import { HelperJobReview, HelperJobReviewDocument } from 'src/entitites/helper-job-review';
// import { CertificatesService } from 'src/helper-modules/certificates/certificates.service';
// import { SkilHelperService } from 'src/helper-modules/expertise-helper/skill-helper.service';
// import { GeoLocationService } from 'src/helper-modules/geo-location/geo-location.service';
// import { ScheduledJobService } from 'src/modules/scheduled-job/scheduled-job.service';
// import { eAPIResultStatus, Role, JobProgress } from 'src/utils/enum';
// import { PrismaService } from 'src/prisma/prisma.service';
// import {
//   startOfDay,
//   endOfDay,
//   startOfMonth,
//   endOfMonth,
//   subMonths,
//   subWeeks,
//   subDays,
// } from 'date-fns';
// @Injectable()
// export class HelperService {
//   constructor(
//     @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
//     @InjectModel(ScheduledJob.name) private readonly jobRepo: Model<ScheduledJobDocument>,
//     @InjectModel(HelperJobReview.name) private readonly reviewRepo: Model<HelperJobReviewDocument>,
//     private readonly helperLocationService: GeoLocationService,
//     private readonly helperCertificateService: CertificatesService,
//     private readonly helperSkillService: SkilHelperService,
//     private readonly scheduleJobService: ScheduledJobService
//   ) {}

//   async fetchAllHelpers(): Promise<ResponseDTO> {
//     try {
//       const helpers = await this.userModel
//         .find({ role: Role.Helper })
//         .populate({ path: 'last_order_id', select: 'order_number' });

//       return {
//         status: eAPIResultStatus.Success,
//         message: 'Helpers fetched successfully',
//         data: helpers,
//       };
//     } catch (error) {
//       console.error('fetchAllHelpers error:', error);
//       return {
//         status: eAPIResultStatus.Failure,
//         message: 'Failed to fetch helpers',
//       };
//     }
//   }

//   async fetchHelperProfileById(helperId: string): Promise<ResponseDTO> {
//     try {
//       const [helper, location, certificates, skills, orders, counts] = await Promise.all([
//         this.userModel.findById(helperId).lean(),
//         this.helperLocationService.getHelperLocation(helperId),
//         this.helperCertificateService.getAllAcceptedCertificatesByHelperId(helperId),
//         this.helperSkillService.getAllSkillNameByHelperId(helperId),
//         this.scheduleJobService.getOrderByHelperId(helperId),
//         this.scheduleJobService.getJobCountsForCurrentYear(helperId),
//       ]);

//       return {
//         status: eAPIResultStatus.Success,
//         message: 'Helper profile fetched successfully',
//         data: { ...helper, location, certificates, skills, orders, ...counts },
//       };
//     } catch (error) {
//       console.error('fetchHelperProfileById error:', error);
//       return {
//         status: eAPIResultStatus.Failure,
//         message: 'Failed to fetch helper profile',
//       };
//     }
//   }

//   async fetchOrderDetails(orderId: string): Promise<ResponseDTO> {
//     try {
//       const order = await this.scheduleJobService.getOrderDetailsById(orderId);
//       return {
//         status: eAPIResultStatus.Success,
//         message: 'Order details fetched successfully',
//         data: order,
//       };
//     } catch (error) {
//       console.error('fetchOrderDetails error:', error);
//       return {
//         status: eAPIResultStatus.Failure,
//         message: 'Failed to fetch order details',
//       };
//     }
//   }

//   async fetchAllOrdersByHelper(helperId: string): Promise<ResponseDTO> {
//     try {
//       const orders = await this.jobRepo
//         .find({ helper_id: helperId })
//         .populate([
//           {
//             path: 'job_id',
//             populate: [
//               { path: 'address_id' },
//               { path: 'sub_job_id', select: '_id sub_job_name' },
//               { path: 'main_job_id', select: 'main_job_name' },
//             ],
//           },
//           { path: 'customer_id', select: '_id full_name email phone profile_url' },
//         ])
//         .sort({ createdAt: -1 })
//         .lean();

//       const ordersWithReviews = await Promise.all(
//         orders.map(async (order) => {
//           if (order.job_status === JobProgress.Reviewed) {
//             const review = await this.reviewRepo
//               .findOne({ scheduled_job_id: order._id })
//               .select('rating additional_feedback')
//               .lean();
//             return { ...order, review: review || null };
//           }
//           return order;
//         }),
//       );

//       const totalOrders = ordersWithReviews.length;
//       const completedOrders = ordersWithReviews.filter(
//         (o) => o.job_status === JobProgress.Completed || o.job_status === JobProgress.Reviewed,
//       ).length;
//       const cancelledOrders = ordersWithReviews.filter(
//         (o) => o.job_status === JobProgress.Cancel,
//       ).length;

//       return {
//         status: eAPIResultStatus.Success,
//         message: 'Orders fetched successfully',
//         data: { orders: ordersWithReviews, totalOrders, completedOrders, cancelledOrders },
//       };
//     } catch (error) {
//       console.error('fetchAllOrdersByHelper error:', error);
//       return {
//         status: eAPIResultStatus.Failure,
//         message: 'Failed to fetch orders',
//       };
//     }
//   }

//   async fetchActiveHelpers(): Promise<ResponseDTO> {
//     try {
//       const helpers = await this.userModel
//         .find({ role: Role.Helper, isActive: true })
//         .select('name email phone_no');

//       return {
//         status: eAPIResultStatus.Success,
//         message: 'Active helpers fetched successfully',
//         data: helpers,
//       };
//     } catch (error) {
//       console.error('fetchActiveHelpers error:', error);
//       return {
//         status: eAPIResultStatus.Failure,
//         message: 'Failed to fetch active helpers',
//       };
//     }
//   }

//   async searchHelpers(keyword: string): Promise<ResponseDTO> {
//     try {
//       const regex = new RegExp(keyword, 'i');
//       const helpers = await this.userModel.find({
//         role: Role.Helper,
//         $or: [{ name: regex }, { email: regex }],
//       });

//       return {
//         status: eAPIResultStatus.Success,
//         message: 'Helpers search results',
//         data: helpers,
//       };
//     } catch (error) {
//       console.error('searchHelpers error:', error);
//       return {
//         status: eAPIResultStatus.Failure,
//         message: 'Failed to search helpers',
//       };
//     }
//   }

//   async getHelperPerformanceAnalytics(helperId: string): Promise<ResponseDTO> {
//     try {
//       const jobs = await this.jobRepo
//         .find({ helper_id: helperId })
//         .populate({
//           path: 'job_id',
//           select: 'price start_date end_date main_job_id sub_job_id',
//           populate: [
//             { path: 'main_job_id', select: 'main_job_name' },
//             { path: 'sub_job_id', select: 'sub_job_name' },
//           ],
//         })
//         .sort({ createdAt: -1 });

//       const analytics = this.calculateHelperAnalytics(jobs);

//       return {
//         status: eAPIResultStatus.Success,
//         message: 'Helper performance analytics fetched successfully',
//         data: analytics,
//       };
//     } catch (error) {
//       console.error('getHelperPerformanceAnalytics error:', error);
//       return {
//         status: eAPIResultStatus.Failure,
//         message: 'Failed to fetch performance analytics',
//       };
//     }
//   }

//   async getHelperIncomeData(helperId: string, period: string = '6M'): Promise<ResponseDTO> {
//     try {
//       const { startDate, endDate } = this.getDateRangeForPeriod(period);

//       const jobs = await this.jobRepo
//         .find({
//           helper_id: helperId,
//           createdAt: { $gte: startDate, $lte: endDate },
//           job_status: { $in: [JobProgress.Completed, JobProgress.Reviewed] },
//         })
//         .populate('job_id', 'price start_date')
//         .sort({ 'job_id.start_date': 1 });

//       const incomeData = this.processIncomeDataByMonth(jobs);
//       const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);

//       return {
//         status: eAPIResultStatus.Success,
//         message: 'Income data fetched successfully',
//         data: { incomeData, period, totalIncome },
//       };
//     } catch (error) {
//       console.error('getHelperIncomeData error:', error);
//       return {
//         status: eAPIResultStatus.Failure,
//         message: 'Failed to fetch income data',
//       };
//     }
//   }

//   async getAllHelpersPerformanceSummary(): Promise<ResponseDTO> {
//     try {
//       const allHelpers = await this.userModel
//         .find({ role: Role.Helper })
//         .select('_id trader_name alias_name profile_name');

//       const performanceSummaries = await Promise.all(
//         allHelpers.map(async (helper) => {
//           const jobs = await this.jobRepo.find({ helper_id: helper._id }).populate('job_id', 'price');
//           const analytics = this.calculateHelperAnalytics(jobs);
//           return {
//             helperId: helper._id,
//             helperName: helper.trader_name || helper.alias_name || helper.profile_name,
//             ...analytics,
//           };
//         }),
//       );

//       performanceSummaries.sort((a, b) => b.totalEarnings - a.totalEarnings);

//       return {
//         status: eAPIResultStatus.Success,
//         message: 'All helpers performance summary fetched',
//         data: performanceSummaries,
//       };
//     } catch (error) {
//       console.error('getAllHelpersPerformanceSummary error:', error);
//       return {
//         status: eAPIResultStatus.Failure,
//         message: 'Failed to fetch performance summary',
//       };
//     }
//   }

//   async getHelperJobs(helperId: string): Promise<ResponseDTO> {
//     try {
//       const jobs = await this.jobRepo
//         .find({ helper_id: helperId })
//         .populate([
//           {
//             path: 'job_id',
//             populate: [
//               { path: 'address_id' },
//               { path: 'sub_job_id', select: '_id sub_job_name' },
//               { path: 'main_job_id', select: 'main_job_name' },
//             ],
//           },
//           { path: 'customer_id', select: '_id full_name email phone' },
//         ])
//         .sort({ createdAt: -1 })
//         .lean();

//       return {
//         status: eAPIResultStatus.Success,
//         message: 'Helper jobs fetched successfully',
//         data: jobs,
//       };
//     } catch (error) {
//       console.error('getHelperJobs error:', error);
//       return {
//         status: eAPIResultStatus.Failure,
//         message: 'Failed to fetch helper jobs',
//       };
//     }
//   }
//   async getAdminDashboardAnalytics(
//     userId: number,
//     period: 'week' | 'month' | 'year',
//   ) {
//     const [helperCount, userCount] = await Promise.all([
//       this.prisma.helper.count(),
//       this.prisma.user.count(),
//     ]);

//     const { startDate, endDate } = this.getDateRangeForPeriod(period);

//     const jobRequests = await this.prisma.jobRequest.findMany({
//       where: {
//         createdAt: {
//           gte: startDate,
//           lte: endDate,
//         },
//       },
//     });

//     const totalJobs = jobRequests.length;
//     const acceptedJobs = jobRequests.filter((job) => job.status === 'accepted').length;
//     const rejectedJobs = jobRequests.filter((job) => job.status === 'rejected').length;

//     const activeJobs = await this.prisma.job.count({
//       where: {
//         status: 'active',
//       },
//     });

//     const pendingJobs = await this.prisma.job.count({
//       where: {
//         status: 'pending',
//       },
//     });

//     const completedJobs = await this.prisma.job.count({
//       where: {
//         status: 'completed',
//       },
//     });

//     return {
//       totalHelpers: helperCount,
//       totalUsers: userCount,
//       totalJobs,
//       acceptedJobs,
//       rejectedJobs,
//       activeJobs,
//       pendingJobs,
//       completedJobs,
//     };
//   }

//   // Helper dashboard data
//   async getHelperDashboardAnalytics(helperId: number) {
//     const jobs = await this.prisma.job.findMany({
//       where: {
//         helperId,
//       },
//     });

//     const jobRequests = await this.prisma.jobRequest.findMany({
//       where: {
//         helperId,
//       },
//     });

//     const completedJobs = jobs.filter((job) => job.status === 'completed').length;
//     const activeJobs = jobs.filter((job) => job.status === 'active').length;
//     const pendingJobs = jobs.filter((job) => job.status === 'pending').length;

//     const acceptedRequests = jobRequests.filter((req) => req.status === 'accepted').length;
//     const rejectedRequests = jobRequests.filter((req) => req.status === 'rejected').length;

//     return {
//       ...this.calculateHelperAnalytics(jobs, jobRequests),
//       completedJobs,
//       activeJobs,
//       pendingJobs,
//       acceptedRequests,
//       rejectedRequests,
//     };
//   }

//   // Monthly income for helper (past 12 months)
//   async getIncomeDataByMonth(helperId: number) {
//     const now = new Date();
//     const startDate = startOfMonth(subMonths(now, 11));
//     const endDate = endOfMonth(now);

//     const jobs = await this.prisma.job.findMany({
//       where: {
//         helperId,
//         status: 'completed',
//         completedAt: {
//           gte: startDate,
//           lte: endDate,
//         },
//       },
//     });

//     return this.processIncomeDataByMonth(jobs);
//   }

//   // ------------------- PRIVATE METHODS -------------------

//   private calculateHelperAnalytics(jobs: any[], jobRequests: any[]) {
//     const totalJobs = jobs.length;
//     const totalRequests = jobRequests.length;

//     return {
//       totalJobs,
//       totalRequests,
//     };
//   }

//   private getDateRangeForPeriod(period: 'week' | 'month' | 'year') {
//     const now = new Date();
//     let startDate: Date;

//     switch (period) {
//       case 'week':
//         startDate = startOfDay(subWeeks(now, 1));
//         break;
//       case 'month':
//         startDate = startOfMonth(now);
//         break;
//       case 'year':
//         startDate = subMonths(now, 12);
//         break;
//       default:
//         startDate = startOfDay(subDays(now, 7));
//     }

//     return {
//       startDate,
//       endDate: endOfDay(now),
//     };
//   }

//   private processIncomeDataByMonth(jobs: any[]) {
//     const incomeByMonth: { [key: string]: number } = {};

//     jobs.forEach((job) => {
//       const month = job.completedAt.toISOString().slice(0, 7); // "YYYY-MM"
//       incomeByMonth[month] = (incomeByMonth[month] || 0) + job.price;
//     });

//     const result: { month: string; income: number }[] = [];
//     const now = new Date();

//     for (let i = 11; i >= 0; i--) {
//       const date = subMonths(now, i);
//       const month = date.toISOString().slice(0, 7);
//       result.push({
//         month,
//         income: incomeByMonth[month] || 0,
//       });
//     }

//     return result;
//   }

// }
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { User, UserDocument } from 'src/entitites/user';
import { ScheduledJob, ScheduledJobDocument } from 'src/entitites/scheduled-job';
import { HelperJobReview, HelperJobReviewDocument } from 'src/entitites/helper-job-review';
import { CertificatesService } from 'src/helper-modules/certificates/certificates.service';
import { SkilHelperService } from 'src/helper-modules/expertise-helper/skill-helper.service';
import { GeoLocationService } from 'src/helper-modules/geo-location/geo-location.service';
import { ScheduledJobService } from 'src/modules/scheduled-job/scheduled-job.service';
import { eAPIResultStatus, Role, JobProgress } from 'src/utils/enum';
import { 
  startOfMonth, 
  endOfMonth, 
  subMonths, 
  startOfDay, 
  endOfDay, 
  subWeeks, 
  subDays 
} from 'date-fns';

interface HelperAnalytics {
  totalJobs: number;
  completedJobs: number;
  canceledJobs: number;
  totalEarnings: number;
  averageRating: number;
  completionRate: number;
}

interface IncomeData {
  month: string;
  amount: number;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class HelperService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ScheduledJob.name) private readonly jobRepo: Model<ScheduledJobDocument>,
    @InjectModel(HelperJobReview.name) private readonly reviewRepo: Model<HelperJobReviewDocument>,
    private readonly helperLocationService: GeoLocationService,
    private readonly helperCertificateService: CertificatesService,
    private readonly helperSkillService: SkilHelperService,
    private readonly scheduleJobService: ScheduledJobService,
  ) {}



async fetchAllHelpers(): Promise<ResponseDTO> {
  try {
    const helpers = await this.userModel
      .find({ role: Role.Helper })
      .populate({
        path: 'last_order_id',
        select: 'order_number job_id',
        populate: {
          path: 'job_id',
          select: 'price',
        },
      })
      .lean();

    const now = new Date();

    const helpersWithDetails = await Promise.all(
      helpers.map(async (helper: any) => {
        const getMonthlyTotal = async (monthOffset: number) => {
          const monthStart = startOfMonth(subMonths(now, monthOffset));
          const monthEnd = endOfMonth(subMonths(now, monthOffset));

          const jobs = await this.jobRepo.find({
            helper_id: helper._id,
            job_status: { $in: [JobProgress.Completed, JobProgress.Reviewed] },
            createdAt: { $gte: monthStart, $lte: monthEnd },
          });

          return jobs.reduce((sum, job: any) => sum + (job?.price || 0), 0);
        };

        // Calculate totals for last 6 months
        const [
          month0, // current
          month1,
          month2,
          month3,
          month4,
          month5,
        ] = await Promise.all([
          getMonthlyTotal(0),
          getMonthlyTotal(1),
          getMonthlyTotal(2),
          getMonthlyTotal(3),
          getMonthlyTotal(4),
          getMonthlyTotal(5),
        ]);

        const last3MonthsTotal = month0 + month1 + month2;
        const prev3MonthsTotal = month3 + month4 + month5;

        let trend: 'up' | 'down' | 'same' = 'same';
        if (last3MonthsTotal > prev3MonthsTotal) trend = 'up';
        else if (last3MonthsTotal < prev3MonthsTotal) trend = 'down';

        return {
          ...helper,
          last_order_price: helper?.last_order_id?.job_id?.price ?? 0,
          monthlyCompletedJobs: await this.jobRepo.countDocuments({
            helper_id: helper._id,
            job_status: { $in: [JobProgress.Completed, JobProgress.Reviewed] },
            createdAt: { $gte: startOfMonth(now), $lte: endOfMonth(now) },
          }),
          trend3M: trend,
        };
      })
    );

    return {
      status: eAPIResultStatus.Success,
      message: 'Helpers fetched successfully',
      data: helpersWithDetails,
    };
  } catch (error) {
    console.error('fetchAllHelpers error:', error);
    return {
      status: eAPIResultStatus.Failure,
      message: 'Failed to fetch helpers',
    };
  }
}



// async fetchAllHelpers(): Promise<ResponseDTO> {
//   try {
//     const helpers = await this.userModel
//       .find({ role: Role.Helper })
//       .populate({
//         path: 'last_order_id',
//         select: 'order_number job_id',
//         populate: {
//           path: 'job_id',
//           select: 'price',
//         },
//       })
//       .lean();

//     const now = new Date();

//     const helpersWithDetails = await Promise.all(
//       helpers.map(async (helper: any) => {
//         const priceInMonth = async (monthOffset: number) => {
//           const monthStart = startOfMonth(subMonths(now, monthOffset));
//           const monthEnd = endOfMonth(subMonths(now, monthOffset));

//           const jobs = await this.jobRepo.find({
//             helper_id: helper._id,
//             job_status: { $in: [JobProgress.Completed, JobProgress.Reviewed] },
//             createdAt: { $gte: monthStart, $lte: monthEnd },
//           });

//           return jobs.reduce((sum, job: any) => sum + (job?.price || 0), 0);
//         };

//         const priceThisMonth = await priceInMonth(0);
//         const priceLastMonth = await priceInMonth(1);
//         const price2MonthAgo = await priceInMonth(2);

//         // Determine trend
//         let trend = 'flat';
//         if (priceThisMonth > priceLastMonth && priceLastMonth > price2MonthAgo) {
//           trend = 'up';
//         } else if (priceThisMonth < priceLastMonth && priceLastMonth < price2MonthAgo) {
//           trend = 'down';
//         }

//         return {
//           ...helper,
//           last_order_price: helper?.last_order_id?.job_id?.price ?? 0,
//           monthlyCompletedJobs: await this.jobRepo.countDocuments({
//             helper_id: helper._id,
//             job_status: { $in: [JobProgress.Completed, JobProgress.Reviewed] },
//             createdAt: { $gte: startOfMonth(now), $lte: endOfMonth(now) },
//           }),
//           trend3M: trend, // ➕ add this to use in frontend UI
//         };
//       })
//     );

//     return {
//       status: eAPIResultStatus.Success,
//       message: 'Helpers fetched successfully',
//       data: helpersWithDetails,
//     };
//   } catch (error) {
//     console.error('fetchAllHelpers error:', error);
//     return {
//       status: eAPIResultStatus.Failure,
//       message: 'Failed to fetch helpers',
//     };
//   }
// }

// async fetchAllHelpers(): Promise<ResponseDTO> {
//   try {
//     const helpers = await this.userModel
//       .find({ role: Role.Helper })
//       .populate({
//         path: 'last_order_id',
//         select: 'order_number job_id',
//         populate: {
//           path: 'job_id',
//           select: 'price'
//         }
//       })
//       .lean(); 
//     const helpersWithPrice = helpers.map((helper: any) => ({
//       ...helper,
//       last_order_price: helper?.last_order_id?.job_id?.price ?? 0
//     }));

//     return {
//       status: eAPIResultStatus.Success,
//       message: 'Helpers fetched successfully',
//       data: helpersWithPrice
//     };
//   } catch (error) {
//     console.error('fetchAllHelpers error:', error);
//     return {
//       status: eAPIResultStatus.Failure,
//       message: 'Failed to fetch helpers'
//     };
//   }
// }

// async fetchAllHelpers(): Promise<ResponseDTO> {
//   try {
//     const helpers = await this.userModel
//       .find({ role: Role.Helper })
//       .populate({
//         path: 'last_order_id',
//         select: 'order_number job_id',
//         populate: {
//           path: 'job_id',
//           select: 'price',
//         },
//       })
//       .lean();

//     // Get date range for current month
//     const start = startOfMonth(new Date());
//     const end = endOfMonth(new Date());

//     const helpersWithDetails = await Promise.all(
//       helpers.map(async (helper: any) => {
//         // Count completed or reviewed jobs this month for each helper
//         const monthlyJobsCount = await this.jobRepo.countDocuments({
//           helper_id: helper._id,
//           job_status: { $in: [JobProgress.Completed, JobProgress.Reviewed] },
//           createdAt: { $gte: start, $lte: end },
//         });

//         return {
//           ...helper,
//           last_order_price: helper?.last_order_id?.job_id?.price ?? 0,
//           monthlyCompletedJobs: monthlyJobsCount,
//         };
//       })
//     );

//     return {
//       status: eAPIResultStatus.Success,
//       message: 'Helpers fetched successfully',
//       data: helpersWithDetails,
//     };
//   } catch (error) {
//     console.error('fetchAllHelpers error:', error);
//     return {
//       status: eAPIResultStatus.Failure,
//       message: 'Failed to fetch helpers',
//     };
//   }
// }

  async fetchHelperProfileById(helperId: string): Promise<ResponseDTO> {
    try {
      const [helper, location, certificates, skills, orders, counts] = await Promise.all([
        this.userModel.findById(helperId).lean(),
        this.helperLocationService.getHelperLocation(helperId),
        this.helperCertificateService.getAllAcceptedCertificatesByHelperId(helperId),
        this.helperSkillService.getAllSkillNameByHelperId(helperId),
        this.scheduleJobService.getOrderByHelperId(helperId),
        this.scheduleJobService.getJobCountsForCurrentYear(helperId),
      ]);

      if (!helper) {
        return {
          status: eAPIResultStatus.Failure,
          message: 'Helper not found',
        };
      }

      return {
        status: eAPIResultStatus.Success,
        message: 'Helper profile fetched successfully',
        data: { ...helper, location, certificates, skills, orders, ...counts },
      };
    } catch (error) {
      console.error('fetchHelperProfileById error:', error);
      return { 
        status: eAPIResultStatus.Failure, 
        message: 'Failed to fetch helper profile' 
      };
    }
  }

  async fetchOrderDetails(orderId: string): Promise<ResponseDTO> {
    try {
      const order = await this.scheduleJobService.getOrderDetailsById(orderId);
      
      if (!order) {
        return {
          status: eAPIResultStatus.Failure,
          message: 'Order not found',
        };
      }

      return { 
        status: eAPIResultStatus.Success, 
        message: 'Order details fetched successfully', 
        data: order 
      };
    } catch (error) {
      console.error('fetchOrderDetails error:', error);
      return { 
        status: eAPIResultStatus.Failure, 
        message: 'Failed to fetch order details' 
      };
    }
  }

  async fetchAllOrdersByHelper(helperId: string): Promise<ResponseDTO> {
    try {
      const orders = await this.jobRepo
        .find({ helper_id: helperId })
        .populate([
          {
            path: 'job_id',
            populate: [
              { path: 'address_id' },
              { path: 'sub_job_id', select: '_id sub_job_name' },
              { path: 'main_job_id', select: 'main_job_name' },
            ],
          },
          { path: 'customer_id', select: '_id full_name email phone profile_url' },
        ])
        .sort({ createdAt: -1 })
        .lean();

      const ordersWithReviews = await Promise.all(
        orders.map(async (order) => {
          if (order.job_status === JobProgress.Reviewed) {
            const review = await this.reviewRepo
              .findOne({ scheduled_job_id: order._id })
              .select('rating additional_feedback')
              .lean();
            return { ...order, review: review || null };
          }
          return order;
        }),
      );

      const total = ordersWithReviews.length;
      const completed = ordersWithReviews.filter(
        (o) =>
          o.job_status === JobProgress.Completed || o.job_status === JobProgress.Reviewed,
      ).length;
      const canceled = ordersWithReviews.filter((o) => o.job_status === JobProgress.Cancel).length;

      return {
        status: eAPIResultStatus.Success,
        message: 'Orders fetched successfully',
        data: { orders: ordersWithReviews, total, completed, canceled },
      };
    } catch (error) {
      console.error('fetchAllOrdersByHelper error:', error);
      return { 
        status: eAPIResultStatus.Failure, 
        message: 'Failed to fetch orders' 
      };
    }
  }

  async fetchActiveHelpers(): Promise<ResponseDTO> {
    try {
      const helpers = await this.userModel
        .find({ role: Role.Helper, isActive: true })
        .select('name email phone_no');

      return {
        status: eAPIResultStatus.Success,
        message: 'Active helpers fetched successfully',
        data: helpers,
      };
    } catch (error) {
      console.error('fetchActiveHelpers error:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Failed to fetch active helpers',
      };
    }
  }

  async searchHelpers(keyword: string): Promise<ResponseDTO> {
    try {
      if (!keyword || keyword.trim().length === 0) {
        return {
          status: eAPIResultStatus.Failure,
          message: 'Search keyword is required',
        };
      }

      const regex = new RegExp(keyword.trim(), 'i');
      const helpers = await this.userModel.find({
        role: Role.Helper,
        $or: [{ name: regex }, { email: regex }],
      });

      return {
        status: eAPIResultStatus.Success,
        message: 'Helper search results fetched successfully',
        data: helpers,
      };
    } catch (error) {
      console.error('searchHelpers error:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Failed to search helpers',
      };
    }
  }

  async getHelperPerformanceAnalytics(helperId: string): Promise<ResponseDTO> {
    try {
      const jobs = await this.jobRepo
        .find({ helper_id: helperId })
        .populate({
          path: 'job_id',
          select: 'price start_date end_date main_job_id sub_job_id',
          populate: [
            { path: 'main_job_id', select: 'main_job_name' },
            { path: 'sub_job_id', select: 'sub_job_name' },
          ],
        })
        .sort({ createdAt: -1 });

      const analytics = this.calculateHelperAnalytics(jobs);

      return {
        status: eAPIResultStatus.Success,
        message: 'Helper performance analytics fetched successfully',
        data: analytics,
      };
    } catch (error) {
      console.error('getHelperPerformanceAnalytics error:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Failed to fetch performance analytics',
      };
    }
  }

  async getHelperIncomeData(helperId: string, period: string = '6M'): Promise<ResponseDTO> {
    try {
      const { startDate, endDate } = this.getDateRangeForPeriod(period);

      const jobs = await this.jobRepo
        .find({
          helper_id: helperId,
          createdAt: { $gte: startDate, $lte: endDate },
          job_status: { $in: [JobProgress.Completed, JobProgress.Reviewed] },
        })
        .populate('job_id', 'price start_date')
        .sort({ 'job_id.start_date': 1 });

      const incomeData = this.processIncomeDataByMonth(jobs);
      const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);

      return {
        status: eAPIResultStatus.Success,
        message: 'Income data fetched successfully',
        data: { incomeData, period, totalIncome },
      };
    } catch (error) {
      console.error('getHelperIncomeData error:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Failed to fetch income data',
      };
    }
  }

  async getAllHelpersPerformanceSummary(): Promise<ResponseDTO> {
    try {
      const allHelpers = await this.userModel
        .find({ role: Role.Helper })
        .select('_id trader_name alias_name profile_name');

      const performanceSummaries = await Promise.all(
        allHelpers.map(async (helper) => {
          const jobs = await this.jobRepo.find({ helper_id: helper._id }).populate('job_id', 'price');
          const analytics = this.calculateHelperAnalytics(jobs);
          return {
            helperId: helper._id,
            helperName: helper.trader_name || helper.alias_name || helper.profile_name,
            ...analytics,
          };
        }),
      );

      performanceSummaries.sort((a, b) => b.totalEarnings - a.totalEarnings);

      return {
        status: eAPIResultStatus.Success,
        message: 'All helpers performance summary fetched successfully',
        data: performanceSummaries,
      };
    } catch (error) {
      console.error('getAllHelpersPerformanceSummary error:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Failed to fetch performance summary',
      };
    }
  }

  async getHelperJobs(helperId: string): Promise<ResponseDTO> {
    try {
      const jobs = await this.jobRepo
        .find({ helper_id: helperId })
        .populate([
          {
            path: 'job_id',
            populate: [
              { path: 'address_id' },
              { path: 'sub_job_id', select: '_id sub_job_name' },
              { path: 'main_job_id', select: 'main_job_name' },
            ],
          },
          { path: 'customer_id', select: '_id full_name email phone' },
        ])
        .sort({ createdAt: -1 })
        .lean();

      return {
        status: eAPIResultStatus.Success,
        message: 'Helper jobs fetched successfully',
        data: jobs,
      };
    } catch (error) {
      console.error('getHelperJobs error:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Failed to fetch helper jobs',
      };
    }
  }

  async getHelperDashboardData(helperId: string): Promise<ResponseDTO> {
    try {
      const jobs = await this.jobRepo
        .find({ helper_id: helperId })
        .populate('job_id', 'price start_date end_date')
        .lean();

      const analytics = this.calculateHelperAnalytics(jobs);
      
      const activeJobs = jobs.filter(job => 
        job.job_status !== JobProgress.Completed && 
        job.job_status !== JobProgress.Cancel &&
        job.job_status !== JobProgress.Reviewed
      ).length;

      const pendingJobs = jobs.filter(job => 
        job.job_status === JobProgress.Pending  
        // job.job_status === JobProgress.Assigned
      ).length;

      // Get recent jobs (last 5)
      const recentJobs = jobs
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      return {
        status: eAPIResultStatus.Success,
        message: 'Helper dashboard data fetched successfully',
        data: {
          ...analytics,
          activeJobs,
          pendingJobs,
          recentJobs,
        },
      };
    } catch (error) {
      console.error('getHelperDashboardData error:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Failed to fetch helper dashboard data',
      };
    }
  }


  private calculateHelperAnalytics(jobs: any[]): HelperAnalytics {
    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(
      (job) => job.job_status === JobProgress.Completed || job.job_status === JobProgress.Reviewed
    ).length;
    const canceledJobs = jobs.filter((job) => job.job_status === JobProgress.Cancel).length;
    
    const totalEarnings = jobs
      .filter((job) => 
        job.job_status === JobProgress.Completed || job.job_status === JobProgress.Reviewed
      )
      .reduce((sum, job) => sum + (job.job_id?.price || 0), 0);

    const completionRate = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;

    // Calculate average rating (you might need to adjust this based on your review structure)
    const averageRating = 0; // Placeholder - implement based on your review system

    return {
      totalJobs,
      completedJobs,
      canceledJobs,
      totalEarnings,
      averageRating,
      completionRate,
    };
  }

  private getDateRangeForPeriod(period: string): DateRange {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '1W':
        startDate = startOfDay(subWeeks(now, 1));
        break;
      case '1M':
        startDate = startOfMonth(now);
        break;
      case '3M':
        startDate = startOfDay(subMonths(now, 3));
        break;
      case '6M':
        startDate = startOfDay(subMonths(now, 6));
        break;
      case '1Y':
        startDate = startOfDay(subMonths(now, 12));
        break;
      default:
        startDate = startOfDay(subMonths(now, 6));
    }

    return {
      startDate,
      endDate: endOfDay(now),
    };
  }

  private processIncomeDataByMonth(jobs: any[]): IncomeData[] {
    const incomeByMonth: { [key: string]: number } = {};

    jobs.forEach((job) => {
      if (job.job_id?.start_date) {
        const month = new Date(job.job_id.start_date).toISOString().slice(0, 7); // "YYYY-MM"
        incomeByMonth[month] = (incomeByMonth[month] || 0) + (job.job_id.price || 0);
      }
    });

    const result: IncomeData[] = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = subMonths(now, i);
      const month = date.toISOString().slice(0, 7);
      result.push({
        month,
        amount: incomeByMonth[month] || 0,
      });
    }

    return result;
  }
}
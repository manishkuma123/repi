
// import { InjectModel } from '@nestjs/mongoose';
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { Model } from 'mongoose';
// import { User, UserDocument } from 'src/entitites/user';
// import { HomeOwnerAddress, HomeOwnerAddressDocument } from 'src/entitites/home-owner-address';
// import { ScheduledJob, ScheduledJobDocument } from 'src/entitites/scheduled-job';
// import { HelperJobReview, HelperJobReviewDocument } from 'src/entitites/helper-job-review';
// import { getAllHomeOwnersResponseDTO } from './dtos/response/get-all-home-owner.dto';
// import { ResponseDTO } from 'src/dtos/general-response/general-response';
// import { eAPIResultStatus, JobProgress, Role } from 'src/utils/enum';

// @Injectable()
// export class CustomerService {
//   constructor(
//     @InjectModel(User.name)
//     private userRepo: Model<UserDocument>,

//     @InjectModel(HomeOwnerAddress.name)
//     private addressRepo: Model<HomeOwnerAddressDocument>,

//     @InjectModel(ScheduledJob.name)
//     private jobRepo: Model<ScheduledJobDocument>,

//     @InjectModel(HelperJobReview.name)
//     private reviewRepo: Model<HelperJobReviewDocument>,
//   ) {}

//   async retrieveClients(): Promise<getAllHomeOwnersResponseDTO> {
//     try {
//       const clients = await this.userRepo
//         .find({ role: Role.Customer })
//         .populate({ path: 'last_order_id', select: 'order_number' });
//       return { status: eAPIResultStatus.Success, data: clients };
//     } catch {
//       return { status: eAPIResultStatus.Failure };
//     }
//   }

//   async retrieveClientDetails(clientId: string): Promise<ResponseDTO> {
//     try {
//       const userData = await this.userRepo.findById(clientId).lean();
//       const locations = await this.addressRepo.find({
//         $or: [{ user_id: clientId }, { user_id: userData?._id }],
//       });

//       const bookings = await this.jobRepo.find({ customer_id: '' + clientId }).populate([
//         {
//           path: 'helper_id',
//           select: '_id trader_name alias_name profile_name',
//         },
//         {
//           path: 'job_id',
//           select: 'price start_date end_date extended_start_date extended_end_date',
//           populate: { path: 'main_job_id', select: 'main_job_name' },
//         },
//       ]);

//       const { passed, cancelled } = bookings.reduce(
//         (summary, job) => {
//           job?.job_status === JobProgress.Cancel ? summary.cancelled++ : summary.passed++;
//           return summary;
//         },
//         { passed: 0, cancelled: 0 },
//       );

//       return {
//         status: eAPIResultStatus.Success,
//         data: { ...userData, addresses: locations, orders: bookings, success: passed, fail: cancelled },
//       };
//     } catch {
//       return { status: eAPIResultStatus.Failure };
//     }
//   }
// async updateStatus(id: string, status: string) {
//   const updatedUser = await this.userRepo.findByIdAndUpdate(
//     id,
//     { status },
//     { new: true },
//   );

//   if (!updatedUser) {
//     throw new NotFoundException(`User with ID ${id} not found`);
//   }

//   return updatedUser;
// }

// async retrieveActiveClients(): Promise<getAllHomeOwnersResponseDTO> {
//   try {
//     const activeClients = await this.userRepo.find({
//       role: Role.Customer,
//       status: 'active', // adjust if you use a different field
//     }).populate({ path: 'last_order_id', select: 'order_number' });

//     return {
//       status: eAPIResultStatus.Success,
//       data: activeClients,
//     };
//   } catch (error) {
//     return {
//       status: eAPIResultStatus.Failure,
//     };
//   }
// }

// async retrieveInactiveClients(): Promise<getAllHomeOwnersResponseDTO> {
//   try {
//     const inactiveClients = await this.userRepo.find({
//       role: Role.Customer,
//       status: 'inactive', // adjust if you use a different field
//     }).populate({ path: 'last_order_id', select: 'order_number' });

//     return {
//       status: eAPIResultStatus.Success,
//       data: inactiveClients,
//     };
//   } catch (error) {
//     return {
//       status: eAPIResultStatus.Failure,
//     };
//   }
// }

// async createBooking(data: {
//   customer_id: string;
//   job_id: string;
//   helper_id: string;
//   start_date: Date;
//   end_date: Date;
//   notes?: string;
// }): Promise<ResponseDTO> {
//   try {
//     const newBooking = await this.jobRepo.create({
//       customer_id: data.customer_id,
//       job_id: data.job_id,
//       helper_id: data.helper_id,
//       start_date: data.start_date,
//       end_date: data.end_date,
//       notes: data.notes || '',
//       job_status: JobProgress.Pending, // or another default status
//     });

//     return {
//       status: eAPIResultStatus.Success,
//       data: newBooking,
//     };
//   } catch (error) {
//     console.error('Error creating booking:', error);
//     return {
//       status: eAPIResultStatus.Failure,
//     };
//   }
// }






// async retrieveAllBookings(): Promise<ResponseDTO> {
//   try {
//     const allJobs = await this.jobRepo
//       .find()
//       .populate([
//         {
//           path: 'job_id',
//           populate: [
//             { path: 'address_id' },
//             { path: 'sub_job_id', select: '_id sub_job_name' },
//             { path: 'main_job_id', select: 'main_job_name' },
//           ],
//         },
//         {
//           path: 'helper_id',
//           select: '_id profile_url trader_name alias_name profile_name',
//         },
//         {
//           path: 'customer_id',
//           select: '_id full_name email phone',
//         },
//       ])
//       .lean();

//     // Optionally fetch and append reviews to jobs with status Reviewed
//     const reviewedJobs = await Promise.all(
//       allJobs.map(async (job) => {
//         if (job.job_status === JobProgress.Reviewed) {
//           const review = await this.reviewRepo.findOne({ scheduled_job_id: job._id });
//           // job.comment = review?.additional_feedback || '';
//         }
//         return job;
//       })
//     );

//     return {
//       status: eAPIResultStatus.Success,
//       data: reviewedJobs,
//     };
//   } catch (error) {
//     return {
//       status: eAPIResultStatus.Failure,
//     };
//   }
// }



//   async retrieveBookingDetails(bookingId: string): Promise<ResponseDTO> {
//     try {
//       const job = await this.jobRepo.findById(bookingId)
//         .populate([
//           {
//             path: 'job_id',
//             populate: [
//               { path: 'address_id' },
//               { path: 'sub_job_id', select: '_id sub_job_name' },
//             ],
//           },
//           {
//             path: 'helper_id',
//             select: '_id profile_url trader_name alias_name profile_name',
//           },
//         ])
//         .lean();

//       if (job?.job_status === JobProgress.Reviewed) {
//         const review = await this.reviewRepo.findOne({ scheduled_job_id: bookingId });
//         job['comment'] = review?.additional_feedback;
//       }

//       return { status: eAPIResultStatus.Success, data: job };
//     } catch {
//       return { status: eAPIResultStatus.Failure };
//     }
//   }

// }
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/entitites/user';
import { HomeOwnerAddress, HomeOwnerAddressDocument } from 'src/entitites/home-owner-address';
import { ScheduledJob, ScheduledJobDocument } from 'src/entitites/scheduled-job';
import { HelperJobReview, HelperJobReviewDocument } from 'src/entitites/helper-job-review';
import { getAllHomeOwnersResponseDTO } from './dtos/response/get-all-home-owner.dto';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { eAPIResultStatus, JobProgress, Role } from 'src/utils/enum';
// import dayjs from 'dayjs';
import * as dayjs from 'dayjs';

import { 
  startOfMonth, 
  endOfMonth, 
  subMonths, 
  startOfDay, 
  endOfDay, 
  subWeeks, 
  subDays 
} from 'date-fns';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(User.name)
    private userRepo: Model<UserDocument>,

    @InjectModel(HomeOwnerAddress.name)
    private addressRepo: Model<HomeOwnerAddressDocument>,

    @InjectModel(ScheduledJob.name)
    private jobRepo: Model<ScheduledJobDocument>,

    @InjectModel(HelperJobReview.name)
    private reviewRepo: Model<HelperJobReviewDocument>,
  ) {}




async retrieveClients(): Promise<getAllHomeOwnersResponseDTO> {
    try {
      const clients = await this.userRepo.find({ role: Role.Customer }).lean();

      const enrichedClients = await Promise.all(
        clients.map(async (client) => {
          const clientId = client._id.toString();

          const locations = await this.addressRepo.find({ user_id: clientId }).lean();

          const bookings = await this.jobRepo
            .find({ customer_id: clientId })
            .populate([
              {
                path: 'job_id',
                select: 'price start_date end_date extended_start_date extended_end_date',
                populate: [
                  { path: 'main_job_id', select: 'main_job_name' },
                  { path: 'sub_job_id', select: 'sub_job_name' },
                ],
              },
              {
                path: 'helper_id',
                select: '_id trader_name alias_name profile_name profile_url',
              },
            ])
            .lean();

          const { passed, cancelled } = bookings.reduce(
            (summary, job) => {
              job?.job_status === JobProgress.Cancel
                ? summary.cancelled++
                : summary.passed++;
              return summary;
            },
            { passed: 0, cancelled: 0 }
          );

          const today = dayjs();
          const currentMonth = today.startOf('month');
          const months = [...Array(6)].map((_, i) =>
            currentMonth.subtract(i, 'month').format('YYYY-MM')
          );

          const monthlyTotals: Record<string, number> = {};
          bookings.forEach((job) => {
       
const jobIdData = job.job_id as any;
const price = jobIdData?.price || 0;

const date = dayjs((job.job_id as any)?.start_date);
            const key = date.format('YYYY-MM');
            if (months.includes(key)) {
              monthlyTotals[key] = (monthlyTotals[key] || 0) + price;
            }
          });

          const last3 = months.slice(0, 3).reduce((sum, m) => sum + (monthlyTotals[m] || 0), 0);
          const prev3 = months.slice(3, 6).reduce((sum, m) => sum + (monthlyTotals[m] || 0), 0);

          let trend: 'up' | 'down' | 'same' = 'same';
          if (last3 > prev3) trend = 'up';
          else if (last3 < prev3) trend = 'down';

          return {
            ...client,
            addresses: locations,
            orders: bookings,
            success: passed,
            fail: cancelled,
            trend,
          };
        })
      );

      return {
        status: eAPIResultStatus.Success,
        data: enrichedClients,
      };
    } catch (error) {
      console.error('Error in retrieveClients:', error);
      return { status: eAPIResultStatus.Failure };
    }
  }








  async retrieveClientDetails(clientId: string): Promise<ResponseDTO> {
    try {
      const userData = await this.userRepo.findById(clientId).lean();
      const locations = await this.addressRepo.find({
        $or: [{ user_id: clientId }, { user_id: userData?._id }],
      });

      const bookings = await this.jobRepo.find({ customer_id: '' + clientId }).populate([
        {
          path: 'helper_id',
          select: '_id trader_name alias_name profile_name',
        },
        {
          path: 'job_id',
          select: 'price start_date end_date extended_start_date extended_end_date',
          populate: { path: 'main_job_id', select: 'main_job_name' },
        },
      ]);

      const { passed, cancelled } = bookings.reduce(
        (summary, job) => {
          job?.job_status === JobProgress.Cancel ? summary.cancelled++ : summary.passed++;
          return summary;
        },
        { passed: 0, cancelled: 0 },
      );

      return {
        status: eAPIResultStatus.Success,
        data: { ...userData, addresses: locations, orders: bookings, success: passed, fail: cancelled },
      };
    } catch {
      return { status: eAPIResultStatus.Failure };
    }
  }

  async updateStatus(id: string, status: string) {
    const updatedUser = await this.userRepo.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  async retrieveActiveClients(): Promise<getAllHomeOwnersResponseDTO> {
    try {
      const activeClients = await this.userRepo.find({
        role: Role.Customer,
        status: 'active',
      }).populate({ path: 'last_order_id', select: 'order_number' });

      return {
        status: eAPIResultStatus.Success,
        data: activeClients,
      };
    } catch (error) {
      return {
        status: eAPIResultStatus.Failure,
      };
    }
  }

  async retrieveInactiveClients(): Promise<getAllHomeOwnersResponseDTO> {
    try {
      const inactiveClients = await this.userRepo.find({
        role: Role.Customer,
        status: 'inactive',
      }).populate({ path: 'last_order_id', select: 'order_number' });

      return {
        status: eAPIResultStatus.Success,
        data: inactiveClients,
      };
    } catch (error) {
      return {
        status: eAPIResultStatus.Failure,
      };
    }
  }

  async createBooking(data: {
    customer_id: string;
    job_id: string;
    helper_id: string;
    start_date: Date;
    end_date: Date;
    notes?: string;
  }): Promise<ResponseDTO> {
    try {
      const newBooking = await this.jobRepo.create({
        customer_id: data.customer_id,
        job_id: data.job_id,
        helper_id: data.helper_id,
        start_date: data.start_date,
        end_date: data.end_date,
        notes: data.notes || '',
        job_status: JobProgress.Pending,
      });

      return {
        status: eAPIResultStatus.Success,
        data: newBooking,
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        status: eAPIResultStatus.Failure,
      };
    }
  }

  async retrieveAllBookings(): Promise<ResponseDTO> {
    try {
      const allJobs = await this.jobRepo
        .find()
        .populate([
          {
            path: 'job_id',
            populate: [
              { path: 'address_id' },
              { path: 'sub_job_id', select: '_id sub_job_name' },
              { path: 'main_job_id', select: 'main_job_name' },
            ],
          },
          {
            path: 'helper_id',
            select: '_id profile_url trader_name alias_name profile_name',
          },
          {
            path: 'customer_id',
            select: '_id full_name email phone',
          },
        ])
        .lean();

      const reviewedJobs = await Promise.all(
        allJobs.map(async (job) => {
          if (job.job_status === JobProgress.Reviewed) {
            const review = await this.reviewRepo.findOne({ scheduled_job_id: job._id });
          }
          return job;
        })
      );

      return {
        status: eAPIResultStatus.Success,
        data: reviewedJobs,
      };
    } catch (error) {
      return {
        status: eAPIResultStatus.Failure,
      };
    }
  }
  

  async retrieveBookingDetails(bookingId: string): Promise<ResponseDTO> {
    try {
      const job = await this.jobRepo.findById(bookingId)
        .populate([
          {
            path: 'job_id',
            populate: [
              { path: 'address_id' },
              { path: 'sub_job_id', select: '_id sub_job_name' },
            ],
          },
          {
            path: 'helper_id',
            select: '_id profile_url trader_name alias_name profile_name',
          },
        ])
        .lean();

      if (job?.job_status === JobProgress.Reviewed) {
        const review = await this.reviewRepo.findOne({ scheduled_job_id: bookingId });
        job['comment'] = review?.additional_feedback;
      }

      return { status: eAPIResultStatus.Success, data: job };
    } catch {
      return { status: eAPIResultStatus.Failure };
    }
  }

  // NEW PERFORMANCE ANALYTICS METHODS
  async getUserPerformanceAnalytics(userId: string): Promise<ResponseDTO> {
    try {
      const userBookings = await this.jobRepo
        .find({ customer_id: userId })
        .populate([
          {
            path: 'job_id',
            select: 'price start_date end_date main_job_id sub_job_id',
            populate: [
              { path: 'main_job_id', select: 'main_job_name' },
              { path: 'sub_job_id', select: 'sub_job_name' }
            ]
          }
        ])
        .sort({ createdAt: -1 });

      const analytics = this.calculateUserAnalytics(userBookings);
      
      return {
        status: eAPIResultStatus.Success,
        data: analytics
      };
    } catch (error) {
      console.error('Error fetching user performance analytics:', error);
      return {
        status: eAPIResultStatus.Failure
      };
    }
  }

  async getUserIncomeData(userId: string, period: string = '6M'): Promise<ResponseDTO> {
    try {
      const dateRange = this.getDateRangeForPeriod(period);
      
      const bookings = await this.jobRepo
        .find({
          customer_id: userId,
          createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
          job_status: { $in: [JobProgress.Completed, JobProgress.Reviewed] }
        })
        .populate('job_id', 'price start_date')
        .sort({ 'job_id.start_date': 1 });

      const incomeData = this.processIncomeDataByMonth(bookings);
      
      return {
        status: eAPIResultStatus.Success,
        data: {
          incomeData,
          period,
          totalIncome: incomeData.reduce((sum, item) => sum + item.amount, 0)
        }
      };
    } catch (error) {
      console.error('Error fetching income data:', error);
      return {
        status: eAPIResultStatus.Failure
      };
    }
  }

  async getAllUsersPerformanceSummary(): Promise<ResponseDTO> {
    try {
      const allCustomers = await this.userRepo.find({ role: Role.Customer }).select('_id full_name');
      
      const performanceSummaries = await Promise.all(
        allCustomers.map(async (customer) => {
          const bookings = await this.jobRepo
            .find({ customer_id: customer._id })
            .populate('job_id', 'price');
          
          const analytics = this.calculateUserAnalytics(bookings);
          
          return {
            userId: customer._id,
            userName: customer.full_name,
            ...analytics
          };
        })
      );

      performanceSummaries.sort((a, b) => b.lifetimeValue - a.lifetimeValue);

      return {
        status: eAPIResultStatus.Success,
        data: performanceSummaries
      };
    } catch (error) {
      console.error('Error fetching all users performance summary:', error);
      return {
        status: eAPIResultStatus.Failure
      };
    }
  }


async getUserBookings(userId: string): Promise<ResponseDTO> {
  try {
    const bookings = await this.jobRepo.find({ customer_id: userId })
      .populate([
        {
          path: 'job_id',
          populate: [
            { path: 'address_id' },
            { path: 'sub_job_id', select: '_id sub_job_name' },
            { path: 'main_job_id', select: 'main_job_name' },
          ],
        },
        {
          path: 'helper_id',
          select: '_id profile_url trader_name alias_name profile_name',
        },
      ])
      .sort({ createdAt: -1 })
      .lean();

    return {
      status: eAPIResultStatus.Success,
      data: bookings,
    };
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return {
      status: eAPIResultStatus.Failure,
    };
  }
}



  async getUserDashboardData(userId: string): Promise<ResponseDTO> {
    try {
      const performanceResult = await this.getUserPerformanceAnalytics(userId);
      const incomeResult = await this.getUserIncomeData(userId, '6M');
      
      if (performanceResult.status === eAPIResultStatus.Success && incomeResult.status === eAPIResultStatus.Success) {
        return {
          status: eAPIResultStatus.Success,
          data: {
            analytics: performanceResult.data,
            incomeData: incomeResult.data
          }
        };
      } else {
        return {
          status: eAPIResultStatus.Failure,
          message: 'Failed to fetch dashboard data'
        };
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return {
        status: eAPIResultStatus.Failure,
        message: 'Internal server error'
      };
    }
  }


  private calculateUserAnalytics(bookings: any[]) {
    const completedBookings = bookings.filter(
      booking => booking.job_status === JobProgress.Completed || booking.job_status === JobProgress.Reviewed
    );
    
    const cancelledBookings = bookings.filter(
      booking => booking.job_status === JobProgress.Cancel
    );

    const lifetimeValue = completedBookings.reduce((total, booking) => {
      return total + (booking.job_id?.price || 0);
    }, 0);

    const averageIncome = completedBookings.length > 0 ? lifetimeValue / completedBookings.length : 0;
    const payPerBasket = averageIncome;

    // Find most frequent service
    const serviceFrequency = {};
    completedBookings.forEach(booking => {
      const serviceName = booking.job_id?.main_job_id?.main_job_name || 'Unknown';
      serviceFrequency[serviceName] = (serviceFrequency[serviceName] || 0) + 1;
    });
    
    const mostFrequentService = Object.keys(serviceFrequency).length > 0 
      ? Object.keys(serviceFrequency).reduce((a, b) => 
          serviceFrequency[a] > serviceFrequency[b] ? a : b
        ) 
      : 'Air condition';

    // Find most active day
    const dayFrequency = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    completedBookings.forEach(booking => {
      if (booking.job_id?.start_date) {
        const dayOfWeek = new Date(booking.job_id.start_date).getDay();
        const dayName = days[dayOfWeek];
        dayFrequency[dayName] = (dayFrequency[dayName] || 0) + 1;
      }
    });

    const mostAvailableDay = Object.keys(dayFrequency).length > 0
      ? Object.keys(dayFrequency).reduce((a, b) => 
          dayFrequency[a] > dayFrequency[b] ? a : b
        )
      : 'Wednesday';

    return {
      lifetimeValue: Math.round(lifetimeValue),
      averageIncome: Math.round(averageIncome),
      payPerBasket: Math.round(payPerBasket),
      mostFrequentService,
      mostAvailableDay,
      totalOrders: bookings.length,
      successfulOrders: completedBookings.length,
      failedOrders: cancelledBookings.length,
      currency: 'THB'
    };
  }

  private getDateRangeForPeriod(period: string) {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case '1M':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case '5Y':
        startDate.setFullYear(endDate.getFullYear() - 5);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 6);
    }

    return { startDate, endDate };
  }

  private processIncomeDataByMonth(bookings: any[]) {
    const monthlyData = {};
    
    bookings.forEach(booking => {
      if (booking.job_id?.start_date && booking.job_id?.price) {
        const date = new Date(booking.job_id.start_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: this.getMonthName(date.getMonth()),
            year: date.getFullYear(),
            amount: 0,
            count: 0
          };
        }
        
        monthlyData[monthKey].amount += booking.job_id.price;
        monthlyData[monthKey].count += 1;
      }
    });

    return Object.keys(monthlyData)
      .sort()
      .map(key => monthlyData[key]);
  }

  private getMonthName(monthIndex: number): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthIndex];
  }
}
// import { Controller, Get, Param } from '@nestjs/common';
// import { HelperService } from './service';
// import { ResponseDTO } from 'src/dtos/general-response/general-response';

// @Controller('admin/helper')
// export class HelperController {
//   constructor(private readonly helperService: HelperService) {}

//   @Get('list')
//   async fetchAll(): Promise<ResponseDTO> {
//     return this.helperService.fetchAllHelpers();
//   }
 



//   @Get('active')
// async fetchActiveHelpers(): Promise<ResponseDTO> {
//   return this.helperService.fetchActiveHelpers();
// }

// @Get('search/:keyword')
// async searchHelpers(@Param('keyword') keyword: string): Promise<ResponseDTO> {
//   return this.helperService.searchHelpers(keyword);
// }


//   @Get('profile/:helperId')
//   async fetchHelperProfile(@Param('helperId') helperId: string): Promise<ResponseDTO> {
//     return this.helperService.fetchHelperProfileById(helperId);
//   }

//   @Get('job-details/:orderId')
//   async fetchOrderInfo(@Param('orderId') orderId: string): Promise<ResponseDTO> {
//     return this.helperService.fetchOrderDetails(orderId);
//   }
// }
import { Controller, Get, Param, Query } from '@nestjs/common';
import { HelperService } from './service';
import { ResponseDTO } from 'src/dtos/general-response/general-response';

@Controller('admin/helper')
export class HelperController {
  constructor(private readonly helperService: HelperService) {}

  @Get('list')
  async fetchAll(): Promise<ResponseDTO> {
    return this.helperService.fetchAllHelpers();
  }

  @Get('active')
  async fetchActiveHelpers(): Promise<ResponseDTO> {
    return this.helperService.fetchActiveHelpers();
  }

  @Get('search/:keyword')
  async searchHelpers(@Param('keyword') keyword: string): Promise<ResponseDTO> {
    return this.helperService.searchHelpers(keyword);
  }

  @Get('profile/:helperId')
  async fetchHelperProfile(@Param('helperId') helperId: string): Promise<ResponseDTO> {
    return this.helperService.fetchHelperProfileById(helperId);
  }

  @Get('job-details/:orderId')
  async fetchOrderInfo(@Param('orderId') orderId: string): Promise<ResponseDTO> {
    return this.helperService.fetchOrderDetails(orderId);
  }

  @Get('orders/:helperId')
  async fetchAllOrdersByHelper(@Param('helperId') helperId: string): Promise<ResponseDTO> {
    return this.helperService.fetchAllOrdersByHelper(helperId);
  }

  // NEW PERFORMANCE ANALYTICS ENDPOINTS
  @Get('performance/:helperId')
  async getHelperPerformanceAnalytics(@Param('helperId') helperId: string): Promise<ResponseDTO> {
    return this.helperService.getHelperPerformanceAnalytics(helperId);
  }

  @Get('income/:helperId')
  async getHelperIncomeData(
    @Param('helperId') helperId: string,
    @Query('period') period: string = '6M'
  ): Promise<ResponseDTO> {
    return this.helperService.getHelperIncomeData(helperId, period);
  }

  @Get('performance-summary')
  async getAllHelpersPerformanceSummary(): Promise<ResponseDTO> {
    return this.helperService.getAllHelpersPerformanceSummary();
  }

  @Get('dashboard/:helperId')
  async getHelperDashboardData(@Param('helperId') helperId: string): Promise<ResponseDTO> {
    return this.helperService.getHelperDashboardData(helperId);
  }

  @Get('jobs/:helperId')
  async getHelperJobs(@Param('helperId') helperId: string): Promise<ResponseDTO> {
    return this.helperService.getHelperJobs(helperId);
  }

  // @Get('ratings/:helperId')
  // async getHelperRatings(@Param('helperId') helperId: string): Promise<ResponseDTO> {
  //   return this.helperService.getHelperRatings(helperId);
  // }
}
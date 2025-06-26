

// import {
//   Controller,
//   Get,
//   Param,
//   Post,
//   Body,
//   UseGuards,
// } from '@nestjs/common';
// import { CustomerService } from './owner.service';
// import { getAllHomeOwnersResponseDTO } from './dtos/response/get-all-home-owner.dto';
// import { ResponseDTO } from 'src/dtos/general-response/general-response';
// import { RoleGuard } from '../common/guards/roles.guard'; 
// import { Role } from '../common/decorators/roles.decorator'; 
// import { AuthGuard } from '@nestjs/passport';



// @Controller('admin/client')

// export class CustomerController {
//   constructor(private readonly customerService: CustomerService) {}

//   @Get('/list')
//   // @Role('admin') 
//   async retrieveClients(): Promise<getAllHomeOwnersResponseDTO> {
//     return this.customerService.retrieveClients();
//   }

//   @Get('/details/:clientId')
//   async retrieveClientDetails(@Param('clientId') clientId: string): Promise<ResponseDTO> {
//     return this.customerService.retrieveClientDetails(clientId);
//   }

// @Get('/bookings')
// async retrieveAllBookings(): Promise<ResponseDTO> {
//   return this.customerService.retrieveAllBookings();
// }


//   @Get('/booking/:bookingId')
//   async retrieveBookingDetails(@Param('bookingId') bookingId: string): Promise<ResponseDTO> {
//     return this.customerService.retrieveBookingDetails(bookingId);
//   }

//   @Get('/active')
//   async retrieveActiveClients(): Promise<getAllHomeOwnersResponseDTO> {
//     return this.customerService.retrieveActiveClients();
//   }

//   @Get('/inactive')
//   async retrieveInactiveClients(): Promise<getAllHomeOwnersResponseDTO> {
//     return this.customerService.retrieveInactiveClients();
//   }
// }
import { 
  Controller, 
  Get, 
  Param, 
  Post, 
  Body, 
  UseGuards,
  Query 
} from '@nestjs/common';
import { CustomerService } from './owner.service';
import { getAllHomeOwnersResponseDTO } from './dtos/response/get-all-home-owner.dto';
import { ResponseDTO } from 'src/dtos/general-response/general-response';
import { RoleGuard } from '../common/guards/roles.guard';
import { Role } from '../common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/client')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/list')
  @Role('admin')
  async retrieveClients(): Promise<getAllHomeOwnersResponseDTO> {
    return this.customerService.retrieveClients();
  }

  @Get('/details/:clientId')
  async retrieveClientDetails(@Param('clientId') clientId: string): Promise<ResponseDTO> {
    return this.customerService.retrieveClientDetails(clientId);
  }

  @Get('/bookings')
  async retrieveAllBookings(): Promise<ResponseDTO> {
    return this.customerService.retrieveAllBookings();
  }

  @Get('/bookings/:userId')
async getUserBookings(@Param('userId') userId: string): Promise<ResponseDTO> {
  return this.customerService.getUserBookings(userId);
}


  @Get('/booking/:bookingId')
  async retrieveBookingDetails(@Param('bookingId') bookingId: string): Promise<ResponseDTO> {
    return this.customerService.retrieveBookingDetails(bookingId);
  }

  @Get('/active')
  async retrieveActiveClients(): Promise<getAllHomeOwnersResponseDTO> {
    return this.customerService.retrieveActiveClients();
  }

  @Get('/inactive')
  async retrieveInactiveClients(): Promise<getAllHomeOwnersResponseDTO> {
    return this.customerService.retrieveInactiveClients();
  }

 
  @Get('/performance/:userId')
  async getUserPerformanceAnalytics(@Param('userId') userId: string): Promise<ResponseDTO> {
    return this.customerService.getUserPerformanceAnalytics(userId);
  }

  @Get('/income/:userId')
  async getUserIncomeData(
    @Param('userId') userId: string,
    @Query('period') period: string = '6M'
  ): Promise<ResponseDTO> {
    return this.customerService.getUserIncomeData(userId, period);
  }

  @Get('/performance-summary')
  async getAllUsersPerformanceSummary(): Promise<ResponseDTO> {
    return this.customerService.getAllUsersPerformanceSummary();
  }

  @Get('/dashboard/:userId')
  async getUserDashboardData(@Param('userId') userId: string): Promise<ResponseDTO> {
    return this.customerService.getUserDashboardData(userId);
  }
}
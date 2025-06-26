import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OmiseChargeService } from './omise-charge.service';
import { CreateOmiseChargeDto } from './dto/request/create-omise-charge.dto';
import { VerifyPaymentDto } from './dto/request/verify-payment.dto';


@Controller('omise-charge')
export class OmiseChargeController {
  constructor(private readonly omiseChargeService: OmiseChargeService) {}

  @Post()
  create(@Body() createOmiseChargeDto: CreateOmiseChargeDto) {
    return this.omiseChargeService.create(createOmiseChargeDto);
  }

  @Post('verify-payment')
  verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.omiseChargeService.verifyPayment(verifyPaymentDto);
  }

  @Post('webhook')
  webhook(@Body() body: any) {
    return this.omiseChargeService.processWebhookEvent(body);
  }

}

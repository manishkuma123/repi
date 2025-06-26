import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { HelperJobReviewService } from './helper-job-review.service';
import { CreateHelperJobReviewDTO } from './dtos/request/create-review.dto';
import { AuthGuard } from '../guards/AuthGuard';

@Controller('helper/job-review')
@UseGuards(AuthGuard)
export class HelperJobReviewController {
  constructor(private readonly reviewService: HelperJobReviewService) {}

  @Post()
  async createReview(
    @Body() createHelperJobReviewDto: CreateHelperJobReviewDTO,
  ) {
    return this.reviewService.createReview(createHelperJobReviewDto);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HelperTrainingExamService } from './helper-training-exam.service';
import { HelperTrainingExam } from 'src/entitites/helper-training-exam';
import { CreateHelperTrainingExamResponseDTO } from './dtos/response/create.dto';
import { CreateHelperTrainingExamRequestDTO } from './dtos/request/create.dto';
import { SubmitExamAnswersRequestDTO } from './dtos/request/submit-exam-answers.dto';
import { SubmitExamAnswersResponseDTO } from './dtos/response/submit-exam-answer.dto';
import { AuthGuard } from '../guards/AuthGuard';

@Controller('helper/training-exam')
export class HelperTrainingExamController {
  constructor(
    private readonly helperTrainingExamService: HelperTrainingExamService,
  ) {}

  @Post()
  async create(
    @Body() data: CreateHelperTrainingExamRequestDTO,
  ): Promise<CreateHelperTrainingExamResponseDTO> {
    return this.helperTrainingExamService.create(data);
  }

  @Get(':sessionId')
  async getBySessionId(@Param('sessionId') sessionId: string) {
    return this.helperTrainingExamService.findBySessionId(sessionId);
  }

  @UseGuards(AuthGuard)
  @Post('submit')
  async submitAnswers(
    @Body() data: SubmitExamAnswersRequestDTO,
    @Req() req: any,
  ): Promise<SubmitExamAnswersResponseDTO> {
    return this.helperTrainingExamService.submitAnswers(data, req?.user);
  }
}

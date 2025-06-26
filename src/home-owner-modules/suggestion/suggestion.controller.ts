import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/helper-modules/guards/AuthGuard';
import { SuggestionService } from './suggestion.service';
import { CreateSuggestionResponseDTO } from './dtos/response/create-suggestion.dto';
import { CreateSuggestionDTO } from './dtos/request/create-suggestion.dto';

@Controller('home-owner/suggestion')
@UseGuards(AuthGuard)
export class SuggestionController {
  constructor(private readonly suggestionService: SuggestionService) {}

  @Post()
  async create(
    @Body() createSuggestionDTO: CreateSuggestionDTO,
    @Req() req: any,
  ): Promise<CreateSuggestionResponseDTO> {
    return this.suggestionService.createSuggestion(
      createSuggestionDTO,
      '' + req?.user?._id,
    );
  }

  @Get()
  async getAll(@Req() req: any): Promise<any> {
    return this.suggestionService.getAllSuggestions('' + req?.user?._id);
  }

  @Get(':id')
  async getById(@Param('id') suggestiontId: string): Promise<any> {
    return this.suggestionService.getSuggestionById(suggestiontId);
  }
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateRightsListDto } from './create-rights-list.dto';

export class UpdateRightsListDto extends PartialType(CreateRightsListDto) {}
import { PartialType } from '@nestjs/mapped-types';
import { CreateRightsModuleDto } from './create-rights-module.dto';

export class UpdateRightsModuleDto extends PartialType(CreateRightsModuleDto) {}

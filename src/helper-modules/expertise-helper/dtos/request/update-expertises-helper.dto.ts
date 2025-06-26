import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import {
  CreateSkillsHelperDTO,
  SkillEntry,
} from './create-expertise-helper.dto';
import { Type } from 'class-transformer';

export class UpdateSkillsHelperDTO {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillEntry)
  skills?: SkillEntry[];

  @IsOptional()
  @IsArray()
  removeSkillsIds?: string[];
}

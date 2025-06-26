import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SkillEntry {
  @IsNotEmpty()
  @IsString()
  main_job_id: string;

  @IsArray()
  @IsString({ each: true })
  sub_job_id: string[];
}

export class CreateSkillsHelperDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillEntry)
  skills: SkillEntry[];
}

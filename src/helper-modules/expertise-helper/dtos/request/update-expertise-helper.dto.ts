import { IsOptional } from 'class-validator';

export class UpdateSkillHelperDTO {
  @IsOptional()
  is_enabled?: Boolean;
}

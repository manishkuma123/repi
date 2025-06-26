import { IsString } from 'class-validator';

export class UpdateSiteCheckListHelperDTO {
  @IsString()
  mainJobId?: string;

  @IsString()
  subJobId?: string;

  @IsString()
  title?: string;
}

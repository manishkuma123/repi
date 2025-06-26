import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSiteCheckListHelperDTO {
  @IsNotEmpty()
  @IsString()
  mainJobId: string;

  @IsNotEmpty()
  @IsString()
  subJobId: string;

  @IsNotEmpty()
  @IsString()
  title: string;
}

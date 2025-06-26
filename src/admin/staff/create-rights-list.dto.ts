import { IsString, IsOptional, IsBoolean, IsNumber, IsMongoId } from 'class-validator';

export class CreateRightsListDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsMongoId()
  moduleId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
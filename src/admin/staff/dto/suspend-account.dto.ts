import { IsString, IsOptional, MaxLength } from 'class-validator';

export class SuspendAccountDto {
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Suspension reason cannot exceed 500 characters' })
  reason?: string;
}
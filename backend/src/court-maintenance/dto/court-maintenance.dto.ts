import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { CourtMaintenanceCategory, CourtMaintenanceStatus } from '@prisma/client';

export class CreateCourtMaintenanceDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CourtMaintenanceCategory)
  category?: CourtMaintenanceCategory;

  @IsOptional()
  @IsString()
  wing?: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(CourtMaintenanceStatus)
  status?: CourtMaintenanceStatus;
}

export class UpdateCourtMaintenanceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CourtMaintenanceCategory)
  category?: CourtMaintenanceCategory;

  @IsOptional()
  @IsString()
  wing?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(CourtMaintenanceStatus)
  status?: CourtMaintenanceStatus;
}

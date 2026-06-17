import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CourtStatus, CourtSurface } from '@prisma/client';

export class CreateCourtDto {
  @IsString()
  name: string;

  @IsString()
  wing: string;

  @IsOptional()
  @IsEnum(CourtSurface)
  surface?: CourtSurface;

  @IsOptional()
  @IsString()
  ballMachineSpec?: string;

  @IsOptional()
  @IsEnum(CourtStatus)
  status?: CourtStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateCourtDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  wing?: string;

  @IsOptional()
  @IsEnum(CourtSurface)
  surface?: CourtSurface;

  @IsOptional()
  @IsString()
  ballMachineSpec?: string;

  @IsOptional()
  @IsEnum(CourtStatus)
  status?: CourtStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

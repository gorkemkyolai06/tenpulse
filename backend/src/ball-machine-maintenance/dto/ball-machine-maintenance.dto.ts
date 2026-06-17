import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BallMachinePriority, BallMachineStatus } from '@prisma/client';

export class CreateBallMachineMaintenanceDto {
  @IsUUID()
  courtId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  reportedAt?: string;

  @IsOptional()
  @IsEnum(BallMachinePriority)
  priority?: BallMachinePriority;

  @IsOptional()
  @IsEnum(BallMachineStatus)
  status?: BallMachineStatus;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBallMachineMaintenanceDto {
  @IsOptional()
  @IsUUID()
  courtId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  reportedAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsEnum(BallMachinePriority)
  priority?: BallMachinePriority;

  @IsOptional()
  @IsEnum(BallMachineStatus)
  status?: BallMachineStatus;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

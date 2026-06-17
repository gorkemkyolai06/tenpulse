import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { LessonType, SessionStatus } from '@prisma/client';

export class CreateLessonSessionDto {
  @IsUUID()
  courtId: string;

  @IsOptional()
  @IsDateString()
  sessionAt?: string;

  @IsOptional()
  @IsEnum(LessonType)
  lessonType?: LessonType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cashAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cardAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  participants?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  ballMachineRentalRevenue?: number;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateLessonSessionDto {
  @IsOptional()
  @IsUUID()
  courtId?: string;

  @IsOptional()
  @IsDateString()
  sessionAt?: string;

  @IsOptional()
  @IsEnum(LessonType)
  lessonType?: LessonType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cashAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cardAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  participants?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  ballMachineRentalRevenue?: number;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

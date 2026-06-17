import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { RateCategory, RateStatus } from '@prisma/client';

export class CreateRateTierDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(RateCategory)
  rateCategory?: RateCategory;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMultiplier?: number;

  @IsOptional()
  @IsEnum(RateStatus)
  status?: RateStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateRateTierDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(RateCategory)
  rateCategory?: RateCategory;

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMultiplier?: number;

  @IsOptional()
  @IsEnum(RateStatus)
  status?: RateStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { StringingStatus } from '@prisma/client';

export class CreateStringingOrderDto {
  @IsString()
  customerName: string;

  @IsString()
  stringType: string;

  @IsOptional()
  @IsString()
  racketModel?: string;

  @IsOptional()
  @IsEnum(StringingStatus)
  status?: StringingStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateStringingOrderDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  stringType?: string;

  @IsOptional()
  @IsString()
  racketModel?: string;

  @IsOptional()
  @IsEnum(StringingStatus)
  status?: StringingStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

import { IsOptional, IsEnum, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { QuoteStatus } from '../entities';

export class FilterQuoteDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(QuoteStatus)
  @IsOptional()
  status?: QuoteStatus;

  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsString()
  @IsOptional()
  salesUserId?: string;
}

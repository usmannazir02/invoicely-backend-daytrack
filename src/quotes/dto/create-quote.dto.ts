import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  IsDateString,
  Min,
  Max,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuoteItemType, QuoteStatus } from '../entities';

export class CreateQuoteItemDto {
  @IsEnum(QuoteItemType)
  itemType: QuoteItemType;

  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsString()
  @IsOptional()
  itemDescription?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  brandName?: string;
}

export class CreateQuoteDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsEmail({}, { message: 'Please provide a valid email address format (e.g., name@example.com)' })
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsOptional()
  customerAddress?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  validUntil?: string;

  @IsEnum(QuoteStatus)
  @IsOptional()
  status?: QuoteStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteItemDto)
  items: CreateQuoteItemDto[];
}

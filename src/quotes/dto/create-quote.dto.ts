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
import { QuoteItemType } from '../entities';

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
    @Min(0)
    unitPrice: number;

    @IsNumber()
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

    @IsEmail()
    @IsOptional()
    customerEmail?: string;

    @IsString()
    @IsOptional()
    customerAddress?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(100)
    discountPercentage?: number;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsDateString()
    @IsOptional()
    validUntil?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuoteItemDto)
    items: CreateQuoteItemDto[];
}

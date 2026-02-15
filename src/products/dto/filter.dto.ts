import { IsOptional, IsNumber, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BrandType } from '../entities/brand.entity';
import { StructureType } from '../entities/structure.entity';
import { MiscItemType } from '../entities/misc-item.entity';

export class FilterBrandDto {
    @IsOptional()
    @IsEnum(BrandType)
    type?: BrandType;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isActive?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number = 10;
}

export class FilterInverterDto {
    @IsOptional()
    @IsString()
    brandId?: string;

    @IsOptional()
    @IsString()
    model?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    minPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    maxPrice?: number;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isActive?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number = 10;
}

export class FilterSolarPanelDto {
    @IsOptional()
    @IsString()
    brandId?: string;

    @IsOptional()
    @IsString()
    model?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    minWattage?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    maxWattage?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    minPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    maxPrice?: number;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isActive?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number = 10;
}

export class FilterStructureDto {
    @IsOptional()
    @IsEnum(StructureType)
    type?: StructureType;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isActive?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number = 10;
}

export class FilterMiscItemDto {
    @IsOptional()
    @IsEnum(MiscItemType)
    type?: MiscItemType;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isActive?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number = 10;
}

import {
  IsBoolean,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateSolarPanelDto {
  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsUUID()
  @IsNotEmpty()
  brandId: string;

  @IsNumber()
  @IsOptional()
  wattage?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

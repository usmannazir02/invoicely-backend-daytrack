import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { MiscItemType } from '../entities/misc-item.entity';

export class CreateMiscItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(MiscItemType)
  @IsNotEmpty()
  type: MiscItemType;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { BrandType } from '../entities/brand.entity';

export class CreateBrandDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(BrandType)
    @IsNotEmpty()
    type: BrandType;
}

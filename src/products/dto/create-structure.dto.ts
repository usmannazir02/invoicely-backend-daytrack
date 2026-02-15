import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { StructureType } from '../entities/structure.entity';

export class CreateStructureDto {
    @IsEnum(StructureType)
    @IsNotEmpty()
    type: StructureType;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsString()
    @IsOptional()
    description?: string;
}

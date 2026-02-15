import { IsString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreateInverterDto {
    @IsString()
    @IsNotEmpty()
    model: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsUUID()
    @IsNotEmpty()
    brandId: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    capacity?: string;
}

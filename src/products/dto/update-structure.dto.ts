import { PartialType } from '@nestjs/mapped-types';
import { CreateStructureDto } from './create-structure.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateStructureDto extends PartialType(CreateStructureDto) {
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateMiscItemDto } from './create-misc-item.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateMiscItemDto extends PartialType(CreateMiscItemDto) {
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

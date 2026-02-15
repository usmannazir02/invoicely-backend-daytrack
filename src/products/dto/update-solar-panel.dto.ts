import { PartialType } from '@nestjs/mapped-types';
import { CreateSolarPanelDto } from './create-solar-panel.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSolarPanelDto extends PartialType(CreateSolarPanelDto) {
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

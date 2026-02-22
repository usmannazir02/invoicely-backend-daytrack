import { PartialType } from '@nestjs/mapped-types';
import { CreateInverterDto } from './create-inverter.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateInverterDto extends PartialType(CreateInverterDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

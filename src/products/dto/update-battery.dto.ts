import { PartialType } from '@nestjs/mapped-types';
import { CreateBatteryDto } from './create-battery.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateBatteryDto extends PartialType(CreateBatteryDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

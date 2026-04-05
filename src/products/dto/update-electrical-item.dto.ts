import { PartialType } from '@nestjs/mapped-types';
import { CreateElectricalItemDto } from './create-electrical-item.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateElectricalItemDto extends PartialType(CreateElectricalItemDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

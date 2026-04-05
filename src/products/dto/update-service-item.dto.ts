import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceItemDto } from './create-service-item.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateServiceItemDto extends PartialType(CreateServiceItemDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

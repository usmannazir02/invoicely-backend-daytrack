import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateQuoteDto } from './create-quote.dto';
import { QuoteStatus } from '../entities';

export class UpdateQuoteDto extends PartialType(CreateQuoteDto) {
  @IsEnum(QuoteStatus)
  @IsOptional()
  status?: QuoteStatus;
}

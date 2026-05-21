import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { QuoteRepository } from './quote.repository';
import { Quote, QuoteItem } from './entities';
import {
  Structure,
  SolarPanel,
  Inverter,
  Battery,
  ServiceItem,
  ElectricalItem,
  MiscItem,
} from '../products/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quote,
      QuoteItem,
      Structure,
      SolarPanel,
      Inverter,
      Battery,
      ServiceItem,
      ElectricalItem,
      MiscItem,
    ]),
  ],
  controllers: [QuoteController],
  providers: [QuoteService, QuoteRepository],
  exports: [QuoteService],
})
export class QuotesModule {}

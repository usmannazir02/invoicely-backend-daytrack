import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { QuoteRepository } from './quote.repository';
import { Quote, QuoteItem } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, QuoteItem])],
  controllers: [QuoteController],
  providers: [QuoteService, QuoteRepository],
  exports: [QuoteService],
})
export class QuotesModule {}

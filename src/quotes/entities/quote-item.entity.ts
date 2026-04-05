import { AbstractEntity } from '../../lib/common/database/sql/abstract.entity';
import { Column, Entity, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Quote } from './quote.entity';

export enum QuoteItemType {
  SOLAR_PANEL = 'solar_panel',
  INVERTER = 'inverter',
  STRUCTURE = 'structure',
  MISC_ITEM = 'misc_item',
  BATTERY = 'battery',
  SERVICE = 'service',
  ELECTRICAL = 'electrical',
}

@Entity('quote_items')
export class QuoteItem extends AbstractEntity<QuoteItem> {
  @ManyToOne(() => Quote, (quote) => quote.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quoteId' })
  quote: Quote;

  @RelationId((item: QuoteItem) => item.quote)
  quoteId: string;

  @Column({
    type: 'enum',
    enum: QuoteItemType,
  })
  itemType: QuoteItemType;

  @Column()
  itemId: string; // Reference to the actual product

  @Column()
  itemName: string; // Snapshot of product name at time of quote

  @Column({ nullable: true })
  itemDescription: string;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ default: 1 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ nullable: true })
  brandName: string; // For solar panels and inverters
}

import { AbstractEntity } from '../../lib/common/database/sql/abstract.entity';
import { Column, Entity } from 'typeorm';

export enum MiscItemType {
  WIRE = 'wire',
  DB = 'db',
  CIVIL_WORK = 'civil_work',
  TRANSPORTATION = 'transportation',
  NET_METERING = 'net_metering',
  EARTHING = 'earthing',
  LIGHTENING_ARRESTOR = 'lightening_arrestor',
  SMART_METER = 'smart_meter',
}

@Entity('misc_items')
export class MiscItem extends AbstractEntity<MiscItem> {
  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: MiscItemType,
  })
  type: MiscItemType;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  unit: string; // e.g., "per meter", "per unit", "fixed"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;
}

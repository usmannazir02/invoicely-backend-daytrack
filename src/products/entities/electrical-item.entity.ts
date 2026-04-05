import { AbstractEntity } from '../../lib/common/database/sql/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('electrical_items')
export class ElectricalItem extends AbstractEntity<ElectricalItem> {
  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  unit: string; // e.g., "per kW", "fixed"

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;
}

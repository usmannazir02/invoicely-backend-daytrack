import { AbstractEntity } from '../../lib/common/database/sql/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('service_items')
export class ServiceItem extends AbstractEntity<ServiceItem> {
  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  unit: string; // e.g., "per kW", "fixed"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;
}

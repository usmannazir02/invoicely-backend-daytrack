import { AbstractEntity } from '../../lib/common/database/sql/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('batteries')
export class Battery extends AbstractEntity<Battery> {
  @Column()
  name: string;

  @Column({ nullable: true })
  capacity: string; // e.g., "5kWh", "10kWh"

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;
}

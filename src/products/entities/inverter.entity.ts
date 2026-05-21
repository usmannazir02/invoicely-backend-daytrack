import { AbstractEntity } from '../../lib/common/database/sql/abstract.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Brand } from './brand.entity';

@Entity('inverters')
export class Inverter extends AbstractEntity<Inverter> {
  @Column()
  model: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  capacity: string; // e.g., "5kW", "10kW"

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Brand, (brand) => brand.inverters, { eager: true })
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @Column()
  brandId: string;
}

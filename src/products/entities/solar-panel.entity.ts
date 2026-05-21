import { AbstractEntity } from '../../lib/common/database/sql/abstract.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Brand } from './brand.entity';

@Entity('solar_panels')
export class SolarPanel extends AbstractEntity<SolarPanel> {
  @Column()
  model: string; // e.g., "585W", "615W", "550W", "645W"

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  wattage: number; // Wattage in numbers for filtering

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Brand, (brand) => brand.solarPanels, { eager: true })
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @Column()
  brandId: string;
}

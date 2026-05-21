import { AbstractEntity } from '../../lib/common/database/sql/abstract.entity';
import { Column, Entity } from 'typeorm';

export enum StructureType {
  GROUND_MOUNT = 'ground_mount',
  ELEVATED = 'elevated',
  ROOFTOP = 'rooftop',
}

@Entity('structures')
export class Structure extends AbstractEntity<Structure> {
  @Column({
    type: 'enum',
    enum: StructureType,
  })
  type: StructureType;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;
}

import { AbstractEntity } from '../../lib/common/database/sql/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Inverter } from './inverter.entity';
import { SolarPanel } from './solar-panel.entity';

export enum BrandType {
    INVERTER = 'inverter',
    SOLAR_PANEL = 'solar_panel',
}

@Entity('brands')
export class Brand extends AbstractEntity<Brand> {
    constructor(partial?: Partial<Brand>) {
        super(partial || {});
    }

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: BrandType,
    })
    type: BrandType;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Inverter, (inverter) => inverter.brand)
    inverters: Inverter[];

    @OneToMany(() => SolarPanel, (solarPanel) => solarPanel.brand)
    solarPanels: SolarPanel[];
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Brand, Inverter, SolarPanel, Structure, MiscItem, Battery, ServiceItem, ElectricalItem } from './entities';

// Repositories
import {
  BrandRepository,
  InverterRepository,
  SolarPanelRepository,
  StructureRepository,
  MiscItemRepository,
  BatteryRepository,
  ServiceItemRepository,
  ElectricalItemRepository,
} from './repositories';

// Services
import {
  BrandService,
  InverterService,
  SolarPanelService,
  StructureService,
  MiscItemService,
  BatteryService,
  ServiceItemService,
  ElectricalItemService,
} from './services';

// Controllers
import {
  BrandController,
  InverterController,
  SolarPanelController,
  StructureController,
  MiscItemController,
  BatteryController,
  ServiceItemController,
  ElectricalItemController,
} from './controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Brand,
      Inverter,
      SolarPanel,
      Structure,
      MiscItem,
      Battery,
      ServiceItem,
      ElectricalItem,
    ]),
  ],
  controllers: [
    BrandController,
    InverterController,
    SolarPanelController,
    StructureController,
    MiscItemController,
    BatteryController,
    ServiceItemController,
    ElectricalItemController,
  ],
  providers: [
    // Repositories
    BrandRepository,
    InverterRepository,
    SolarPanelRepository,
    StructureRepository,
    MiscItemRepository,
    BatteryRepository,
    ServiceItemRepository,
    ElectricalItemRepository,
    // Services
    BrandService,
    InverterService,
    SolarPanelService,
    StructureService,
    MiscItemService,
    BatteryService,
    ServiceItemService,
    ElectricalItemService,
  ],
  exports: [
    BrandService,
    InverterService,
    SolarPanelService,
    StructureService,
    MiscItemService,
    BatteryService,
    ServiceItemService,
    ElectricalItemService,
  ],
})
export class ProductsModule {}

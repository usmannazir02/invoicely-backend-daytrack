import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Brand, Inverter, SolarPanel, Structure, MiscItem } from './entities';

// Repositories
import {
  BrandRepository,
  InverterRepository,
  SolarPanelRepository,
  StructureRepository,
  MiscItemRepository,
} from './repositories';

// Services
import {
  BrandService,
  InverterService,
  SolarPanelService,
  StructureService,
  MiscItemService,
} from './services';

// Controllers
import {
  BrandController,
  InverterController,
  SolarPanelController,
  StructureController,
  MiscItemController,
} from './controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Brand,
      Inverter,
      SolarPanel,
      Structure,
      MiscItem,
    ]),
  ],
  controllers: [
    BrandController,
    InverterController,
    SolarPanelController,
    StructureController,
    MiscItemController,
  ],
  providers: [
    // Repositories
    BrandRepository,
    InverterRepository,
    SolarPanelRepository,
    StructureRepository,
    MiscItemRepository,
    // Services
    BrandService,
    InverterService,
    SolarPanelService,
    StructureService,
    MiscItemService,
  ],
  exports: [
    BrandService,
    InverterService,
    SolarPanelService,
    StructureService,
    MiscItemService,
  ],
})
export class ProductsModule {}

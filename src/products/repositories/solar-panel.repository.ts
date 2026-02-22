import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { AbstractRepository } from '../../lib/common/database/sql/abstract.repository';
import { SolarPanel } from '../entities/solar-panel.entity';

@Injectable()
export class SolarPanelRepository extends AbstractRepository<SolarPanel> {
  protected readonly logger = new Logger(SolarPanelRepository.name);

  constructor(
    @InjectRepository(SolarPanel)
    private readonly solarPanelRepository: Repository<SolarPanel>,
    entityManager: EntityManager,
  ) {
    super(solarPanelRepository, entityManager);
  }
}

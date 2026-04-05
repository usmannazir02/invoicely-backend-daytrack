import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { AbstractRepository } from '../../lib/common/database/sql/abstract.repository';
import { ElectricalItem } from '../entities/electrical-item.entity';

@Injectable()
export class ElectricalItemRepository extends AbstractRepository<ElectricalItem> {
  protected readonly logger = new Logger(ElectricalItemRepository.name);

  constructor(
    @InjectRepository(ElectricalItem)
    private readonly electricalItemRepository: Repository<ElectricalItem>,
    entityManager: EntityManager,
  ) {
    super(electricalItemRepository, entityManager);
  }
}

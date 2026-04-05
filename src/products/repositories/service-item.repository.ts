import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { AbstractRepository } from '../../lib/common/database/sql/abstract.repository';
import { ServiceItem } from '../entities/service-item.entity';

@Injectable()
export class ServiceItemRepository extends AbstractRepository<ServiceItem> {
  protected readonly logger = new Logger(ServiceItemRepository.name);

  constructor(
    @InjectRepository(ServiceItem)
    private readonly serviceItemRepository: Repository<ServiceItem>,
    entityManager: EntityManager,
  ) {
    super(serviceItemRepository, entityManager);
  }
}

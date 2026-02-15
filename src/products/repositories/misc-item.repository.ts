import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { AbstractRepository } from '../../lib/common/database/sql/abstract.repository';
import { MiscItem } from '../entities/misc-item.entity';

@Injectable()
export class MiscItemRepository extends AbstractRepository<MiscItem> {
    protected readonly logger = new Logger(MiscItemRepository.name);

    constructor(
        @InjectRepository(MiscItem)
        private readonly miscItemRepository: Repository<MiscItem>,
        entityManager: EntityManager,
    ) {
        super(miscItemRepository, entityManager);
    }
}

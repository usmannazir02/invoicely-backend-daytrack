import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { AbstractRepository } from '../../lib/common/database/sql/abstract.repository';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class BrandRepository extends AbstractRepository<Brand> {
    protected readonly logger = new Logger(BrandRepository.name);

    constructor(
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,
        entityManager: EntityManager,
    ) {
        super(brandRepository, entityManager);
    }
}

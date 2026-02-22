import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { AbstractRepository } from '../../lib/common/database/sql/abstract.repository';
import { Structure } from '../entities/structure.entity';

@Injectable()
export class StructureRepository extends AbstractRepository<Structure> {
  protected readonly logger = new Logger(StructureRepository.name);

  constructor(
    @InjectRepository(Structure)
    private readonly structureRepository: Repository<Structure>,
    entityManager: EntityManager,
  ) {
    super(structureRepository, entityManager);
  }
}

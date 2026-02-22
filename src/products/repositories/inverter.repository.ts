import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { AbstractRepository } from '../../lib/common/database/sql/abstract.repository';
import { Inverter } from '../entities/inverter.entity';

@Injectable()
export class InverterRepository extends AbstractRepository<Inverter> {
  protected readonly logger = new Logger(InverterRepository.name);

  constructor(
    @InjectRepository(Inverter)
    private readonly inverterRepository: Repository<Inverter>,
    entityManager: EntityManager,
  ) {
    super(inverterRepository, entityManager);
  }
}

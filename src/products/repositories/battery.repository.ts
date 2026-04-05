import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { AbstractRepository } from '../../lib/common/database/sql/abstract.repository';
import { Battery } from '../entities/battery.entity';

@Injectable()
export class BatteryRepository extends AbstractRepository<Battery> {
  protected readonly logger = new Logger(BatteryRepository.name);

  constructor(
    @InjectRepository(Battery)
    private readonly batteryRepository: Repository<Battery>,
    entityManager: EntityManager,
  ) {
    super(batteryRepository, entityManager);
  }
}

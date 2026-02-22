import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { AbstractRepository } from '../lib/common/database/sql/abstract.repository';
import { Quote } from './entities';

@Injectable()
export class QuoteRepository extends AbstractRepository<Quote> {
  protected readonly logger = new Logger(QuoteRepository.name);

  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepository: Repository<Quote>,
    entityManager: EntityManager,
  ) {
    super(quoteRepository, entityManager);
  }

  createInstance(data: Partial<Quote>): Quote {
    return this.quoteRepository.create(data);
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
    status?: string,
  ) {
    const queryBuilder = this.quoteRepository
      .createQueryBuilder('quote')
      .leftJoinAndSelect('quote.items', 'items')
      .leftJoinAndSelect('quote.createdBy', 'createdBy')
      .where('quote.createdById = :userId', { userId });

    if (status) {
      queryBuilder.andWhere('quote.status = :status', { status });
    }

    queryBuilder
      .orderBy('quote.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findWithItems(id: string): Promise<Quote> {
    return this.quoteRepository
      .createQueryBuilder('quote')
      .leftJoinAndSelect('quote.items', 'items')
      .leftJoinAndSelect('quote.createdBy', 'createdBy')
      .where('quote.id = :id', { id })
      .getOneOrFail();
  }
}

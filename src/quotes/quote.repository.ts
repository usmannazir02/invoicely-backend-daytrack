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

    // calculate global aggregate stats
    const statsQuery = this.quoteRepository
      .createQueryBuilder('quote')
      .select('SUM(quote.finalAmount)', 'totalValue')
      .addSelect(`SUM(CASE WHEN quote.status = 'sent' THEN 1 ELSE 0 END)`, 'sentCount')
      .addSelect(`SUM(CASE WHEN quote.status = 'created' THEN 1 ELSE 0 END)`, 'createdCount')
      .addSelect('COUNT(quote.id)', 'totalQuotes')
      .where('quote.createdById = :userId', { userId });

    if (status) {
      statsQuery.andWhere('quote.status = :status', { status });
    }

    const stats = await statsQuery.getRawOne();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalValue: Number(stats?.totalValue || 0),
        sentCount: Number(stats?.sentCount || 0),
        createdCount: Number(stats?.createdCount || 0),
        totalQuotes: Number(stats?.totalQuotes || 0),
      },
    };
  }

  async findAllForAdmin(
    page: number,
    limit: number,
    status?: string,
    salesUserId?: string,
  ) {
    const queryBuilder = this.quoteRepository
      .createQueryBuilder('quote')
      .leftJoinAndSelect('quote.items', 'items')
      .leftJoinAndSelect('quote.createdBy', 'createdBy');

    if (salesUserId) {
      queryBuilder.andWhere('quote.createdById = :salesUserId', { salesUserId });
    }

    if (status) {
      queryBuilder.andWhere('quote.status = :status', { status });
    }

    queryBuilder
      .orderBy('quote.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    // calculate global aggregate stats
    const statsQuery = this.quoteRepository
      .createQueryBuilder('quote')
      .select('SUM(quote.finalAmount)', 'totalValue')
      .addSelect(`SUM(CASE WHEN quote.status = 'sent' THEN 1 ELSE 0 END)`, 'sentCount')
      .addSelect(`SUM(CASE WHEN quote.status = 'created' THEN 1 ELSE 0 END)`, 'createdCount')
      .addSelect('COUNT(quote.id)', 'totalQuotes');

    if (salesUserId) {
      statsQuery.andWhere('quote.createdById = :salesUserId', { salesUserId });
    }

    if (status) {
      statsQuery.andWhere('quote.status = :status', { status });
    }

    const stats = await statsQuery.getRawOne();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalValue: Number(stats?.totalValue || 0),
        sentCount: Number(stats?.sentCount || 0),
        createdCount: Number(stats?.createdCount || 0),
        totalQuotes: Number(stats?.totalQuotes || 0),
      },
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

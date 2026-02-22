import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import {
  EntityManager,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsSelectByString,
  FindOptionsWhere,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;

  constructor(
    private readonly itemsRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  get metadata() {
    return this.itemsRepository.metadata;
  }

  async create(entity: T | T[]): Promise<T | T[]> {
    return this.itemsRepository.save(entity as any);
  }

  async createEntity(data: Partial<T>): Promise<T> {
    const entity = this.itemsRepository.create(data as any);
    return this.itemsRepository.save(entity) as unknown as Promise<T>;
  }

  async findOne(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    relations?: FindOptionsRelations<T> | any,
    select?: FindOptionsSelect<T> | FindOptionsSelectByString<T>,
    loadRelationIds?:
      | boolean
      | {
          relations?: string[];
          disableMixedMap?: boolean;
        },
    withDeleted?: boolean,
  ): Promise<T> {
    const entity = await this.itemsRepository.findOne({
      where,
      relations,
      select,
      loadRelationIds: loadRelationIds ?? true,
      withDeleted: withDeleted,
    });

    if (!entity) {
      this.logger.warn('Document not found with where', where);
      throw new NotFoundException('Entity not found.');
    }

    return entity;
  }

  async findOneOrNull(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    relations?: FindOptionsRelations<T> | any,
    select?: FindOptionsSelect<T> | FindOptionsSelectByString<T>,
    loadRelationIds?:
      | boolean
      | {
          relations?: string[];
          disableMixedMap?: boolean;
        },
    withDeleted?: boolean,
  ): Promise<T | null> {
    const entity = await this.itemsRepository.findOne({
      where,
      relations,
      select,
      loadRelationIds: loadRelationIds ?? true,
      withDeleted: withDeleted,
    });

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ) {
    const updateResult = await this.itemsRepository.update(
      where,
      partialEntity,
    );

    if (!updateResult.affected) {
      this.logger.warn('Entity not found with where', where);
      throw new NotFoundException('Entity not found.');
    }

    return this.findOne(where);
  }

  async find(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    page?: number,
    limit?: number,
    relations?: FindOptionsRelations<T> | any,
    idOnlyRelations?: string[] | boolean,
    select?: FindOptionsSelect<T> | FindOptionsSelectByString<T>,
    order?: FindOptionsOrder<T>,
  ) {
    const findOptions: any = {
      where,
      relations: relations || [], // Load full objects for these relations
      loadRelationIds: idOnlyRelations
        ? typeof idOnlyRelations === 'boolean'
          ? idOnlyRelations
          : { relations: idOnlyRelations, disableMixedMap: false }
        : undefined,
    };

    // Pagination
    if (page && limit) findOptions.skip = (page - 1) * limit;

    if (limit) {
      findOptions.take = limit;
    }

    // Field Selection
    if (select) findOptions.select = select;

    const [items, totalCount] = await this.itemsRepository.findAndCount({
      ...findOptions,
      order: { createdAt: 'DESC', ...order },
    });

    return {
      data: items,
      page: limit ? page : undefined,
      limit: limit || undefined, // If no limit, set limit to totalCount to show all items
      totalCount,
    };
  }

  async findAndSoftDelete(where: FindOptionsWhere<T>) {
    return await this.itemsRepository.softDelete(where);
  }

  async findAndRestore(where: FindOptionsWhere<T>) {
    return await this.itemsRepository.restore(where);
  }

  async findAndDelete(where: FindOptionsWhere<T>) {
    return await this.itemsRepository.delete(where);
  }

  async count(where?: FindManyOptions<T>) {
    return await this.itemsRepository.count(where);
  }

  createQueryBuilder(
    alias: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<T> {
    return this.itemsRepository.createQueryBuilder(alias, queryRunner);
  }

  query(query: string, parameters?: any[]): Promise<any> {
    return this.itemsRepository.query(query, parameters);
  }
}

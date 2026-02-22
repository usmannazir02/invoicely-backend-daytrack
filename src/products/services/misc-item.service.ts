import { Injectable, NotFoundException } from '@nestjs/common';
import { MiscItemRepository } from '../repositories/misc-item.repository';
import { MiscItem, MiscItemType } from '../entities/misc-item.entity';
import {
  CreateMiscItemDto,
  UpdateMiscItemDto,
  FilterMiscItemDto,
} from '../dto';

@Injectable()
export class MiscItemService {
  constructor(private readonly miscItemRepository: MiscItemRepository) {}

  async create(createMiscItemDto: CreateMiscItemDto): Promise<MiscItem> {
    return this.miscItemRepository.createEntity(createMiscItemDto);
  }

  async findAll(filterDto: FilterMiscItemDto) {
    const { type, isActive, page = 1, limit = 10 } = filterDto;
    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const result = await this.miscItemRepository.find(
      where,
      page,
      limit,
      undefined,
      undefined,
      undefined,
      { createdAt: 'DESC' },
    );

    return {
      items: result.data,
      total: result.totalCount,
      page: result.page ?? page,
      limit: result.limit ?? limit,
      totalPages: limit ? Math.ceil(result.totalCount / limit) : 1,
    };
  }

  async findOne(id: string): Promise<MiscItem> {
    // Allow retrieving inactive misc items so admin can edit/reactivate them.
    return this.miscItemRepository.findOne({ id });
  }

  async findByType(type: MiscItemType): Promise<MiscItem[]> {
    const result = await this.miscItemRepository.find({ type, isActive: true });
    return result.data;
  }

  async update(
    id: string,
    updateMiscItemDto: UpdateMiscItemDto,
  ): Promise<MiscItem> {
    await this.findOne(id);
    const updateData = Object.fromEntries(
      Object.entries(updateMiscItemDto).filter(
        ([_, value]) => value !== undefined,
      ),
    );
    return this.miscItemRepository.findOneAndUpdate({ id }, updateData);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.miscItemRepository.findOneAndUpdate({ id }, { isActive: false });
  }
}

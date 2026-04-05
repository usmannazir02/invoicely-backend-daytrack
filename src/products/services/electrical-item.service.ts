import { Injectable } from '@nestjs/common';
import { ElectricalItemRepository } from '../repositories/electrical-item.repository';
import { ElectricalItem } from '../entities/electrical-item.entity';
import { CreateElectricalItemDto, UpdateElectricalItemDto, FilterElectricalItemDto } from '../dto';

@Injectable()
export class ElectricalItemService {
  constructor(private readonly electricalItemRepository: ElectricalItemRepository) {}

  async create(createElectricalItemDto: CreateElectricalItemDto): Promise<ElectricalItem> {
    return this.electricalItemRepository.createEntity(createElectricalItemDto);
  }

  async findAll(filterDto: FilterElectricalItemDto) {
    const { isActive, page = 1, limit = 10 } = filterDto;
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const result = await this.electricalItemRepository.find(
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

  async findOne(id: string): Promise<ElectricalItem> {
    return this.electricalItemRepository.findOne({ id });
  }

  async update(id: string, updateElectricalItemDto: UpdateElectricalItemDto): Promise<ElectricalItem> {
    await this.findOne(id);
    const updateData = Object.fromEntries(
      Object.entries(updateElectricalItemDto).filter(([_, value]) => value !== undefined),
    );
    return this.electricalItemRepository.findOneAndUpdate({ id }, updateData);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.electricalItemRepository.findOneAndUpdate({ id }, { isActive: false });
  }
}

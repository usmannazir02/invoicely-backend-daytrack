import { Injectable } from '@nestjs/common';
import { ServiceItemRepository } from '../repositories/service-item.repository';
import { ServiceItem } from '../entities/service-item.entity';
import { CreateServiceItemDto, UpdateServiceItemDto, FilterServiceItemDto } from '../dto';

@Injectable()
export class ServiceItemService {
  constructor(private readonly serviceItemRepository: ServiceItemRepository) {}

  async create(createServiceItemDto: CreateServiceItemDto): Promise<ServiceItem> {
    return this.serviceItemRepository.createEntity(createServiceItemDto);
  }

  async findAll(filterDto: FilterServiceItemDto) {
    const { isActive, page = 1, limit = 10 } = filterDto;
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const result = await this.serviceItemRepository.find(
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

  async findOne(id: string): Promise<ServiceItem> {
    return this.serviceItemRepository.findOne({ id });
  }

  async update(id: string, updateServiceItemDto: UpdateServiceItemDto): Promise<ServiceItem> {
    await this.findOne(id);
    const updateData = Object.fromEntries(
      Object.entries(updateServiceItemDto).filter(([_, value]) => value !== undefined),
    );
    return this.serviceItemRepository.findOneAndUpdate({ id }, updateData);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.serviceItemRepository.findOneAndUpdate({ id }, { isActive: false });
  }
}

import { Injectable } from '@nestjs/common';
import { BatteryRepository } from '../repositories/battery.repository';
import { Battery } from '../entities/battery.entity';
import { CreateBatteryDto, UpdateBatteryDto, FilterBatteryDto } from '../dto';

@Injectable()
export class BatteryService {
  constructor(private readonly batteryRepository: BatteryRepository) {}

  async create(createBatteryDto: CreateBatteryDto): Promise<Battery> {
    return this.batteryRepository.createEntity(createBatteryDto);
  }

  async findAll(filterDto: FilterBatteryDto) {
    const { isActive, page = 1, limit = 10 } = filterDto;
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const result = await this.batteryRepository.find(
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

  async findOne(id: string): Promise<Battery> {
    return this.batteryRepository.findOne({ id });
  }

  async update(id: string, updateBatteryDto: UpdateBatteryDto): Promise<Battery> {
    await this.findOne(id);
    const updateData = Object.fromEntries(
      Object.entries(updateBatteryDto).filter(([_, value]) => value !== undefined),
    );
    return this.batteryRepository.findOneAndUpdate({ id }, updateData);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.batteryRepository.findOneAndUpdate({ id }, { isActive: false });
  }
}

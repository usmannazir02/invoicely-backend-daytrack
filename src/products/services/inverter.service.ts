import { Injectable, NotFoundException } from '@nestjs/common';
import { InverterRepository } from '../repositories/inverter.repository';
import { Inverter } from '../entities/inverter.entity';
import {
  CreateInverterDto,
  UpdateInverterDto,
  FilterInverterDto,
} from '../dto';
import { BrandService } from './brand.service';
import { Between, LessThanOrEqual, MoreThanOrEqual, Like } from 'typeorm';

@Injectable()
export class InverterService {
  constructor(
    private readonly inverterRepository: InverterRepository,
    private readonly brandService: BrandService,
  ) {}

  async create(createInverterDto: CreateInverterDto): Promise<Inverter> {
    // Verify brand exists
    await this.brandService.findOne(createInverterDto.brandId);

    return this.inverterRepository.createEntity(createInverterDto);
  }

  async findAll(filterDto: FilterInverterDto) {
    const {
      brandId,
      model,
      minPrice,
      maxPrice,
      isActive,
      page = 1,
      limit = 10,
    } = filterDto;
    const where: any = {};

    if (brandId) {
      where.brandId = brandId;
    }

    if (model) {
      where.model = Like(`%${model}%`);
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.price = LessThanOrEqual(maxPrice);
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const result = await this.inverterRepository.find(
      where,
      page,
      limit,
      ['brand'],
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

  async findOne(id: string): Promise<Inverter> {
    // Allow retrieving inactive inverters so admin can edit/reactivate them.
    return this.inverterRepository.findOne({ id }, ['brand']);
  }

  async findByBrand(brandId: string): Promise<Inverter[]> {
    const result = await this.inverterRepository.find(
      { brandId, isActive: true },
      undefined,
      undefined,
      ['brand'],
    );
    return result.data;
  }

  async update(
    id: string,
    updateInverterDto: UpdateInverterDto,
  ): Promise<Inverter> {
    // Verify entity exists
    await this.findOne(id);

    if (updateInverterDto.brandId) {
      await this.brandService.findOne(updateInverterDto.brandId);
    }

    // Only include defined values to prevent overwriting with undefined
    const updateData = Object.fromEntries(
      Object.entries(updateInverterDto).filter(
        ([_, value]) => value !== undefined,
      ),
    );

    return this.inverterRepository.findOneAndUpdate({ id }, updateData);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.inverterRepository.findOneAndUpdate({ id }, { isActive: false });
  }
}

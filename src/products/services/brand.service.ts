import { Injectable, NotFoundException } from '@nestjs/common';
import { BrandRepository } from '../repositories/brand.repository';
import { Brand, BrandType } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto, FilterBrandDto } from '../dto';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandRepository.createEntity(createBrandDto);
  }

  async findAll(filterDto: FilterBrandDto) {
    const { type, isActive, page = 1, limit = 10 } = filterDto;
    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const result = await this.brandRepository.find(
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

  async findOne(id: string): Promise<Brand> {
    // Allow retrieving inactive brands so admin can edit/reactivate them.
    // Use filtering at query level when you specifically want active-only.
    return this.brandRepository.findOne({ id });
  }

  async findByType(type: BrandType): Promise<Brand[]> {
    const result = await this.brandRepository.find({ type, isActive: true });
    return result.data;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    await this.findOne(id);
    const updateData = Object.fromEntries(
      Object.entries(updateBrandDto).filter(
        ([_, value]) => value !== undefined,
      ),
    );
    return this.brandRepository.findOneAndUpdate({ id }, updateData);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.brandRepository.findOneAndUpdate({ id }, { isActive: false });
  }
}

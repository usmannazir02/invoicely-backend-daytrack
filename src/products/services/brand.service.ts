import { Injectable, NotFoundException } from '@nestjs/common';
import { BrandRepository } from '../repositories/brand.repository';
import { Brand, BrandType } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto, FilterBrandDto } from '../dto';

@Injectable()
export class BrandService {
    constructor(private readonly brandRepository: BrandRepository) { }

    async create(createBrandDto: CreateBrandDto): Promise<Brand> {
        return this.brandRepository.createEntity(createBrandDto) as Promise<Brand>;
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
            data: result.data,
            meta: {
                total: result.totalCount,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.totalCount / limit),
            },
        };
    }

    async findOne(id: string): Promise<Brand> {
        return this.brandRepository.findOne({ id, isActive: true });
    }

    async findByType(type: BrandType): Promise<Brand[]> {
        const result = await this.brandRepository.find({ type, isActive: true });
        return result.data;
    }

    async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
        await this.findOne(id);
        const updateData = Object.fromEntries(
            Object.entries(updateBrandDto).filter(([_, value]) => value !== undefined)
        );
        return this.brandRepository.findOneAndUpdate({ id }, updateData) as Promise<Brand>;
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.brandRepository.findOneAndUpdate({ id }, { isActive: false });
    }
}

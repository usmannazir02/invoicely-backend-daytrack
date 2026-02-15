import { Injectable, NotFoundException } from '@nestjs/common';
import { SolarPanelRepository } from '../repositories/solar-panel.repository';
import { SolarPanel } from '../entities/solar-panel.entity';
import { CreateSolarPanelDto, UpdateSolarPanelDto, FilterSolarPanelDto } from '../dto';
import { BrandService } from './brand.service';
import { Between, LessThanOrEqual, MoreThanOrEqual, Like } from 'typeorm';

@Injectable()
export class SolarPanelService {
    constructor(
        private readonly solarPanelRepository: SolarPanelRepository,
        private readonly brandService: BrandService,
    ) { }

    async create(createSolarPanelDto: CreateSolarPanelDto): Promise<SolarPanel> {
        // Verify brand exists
        await this.brandService.findOne(createSolarPanelDto.brandId);

        return this.solarPanelRepository.createEntity(createSolarPanelDto) as Promise<SolarPanel>;
    }

    async findAll(filterDto: FilterSolarPanelDto) {
        const { brandId, model, minWattage, maxWattage, minPrice, maxPrice, isActive, page = 1, limit = 10 } = filterDto;
        const where: any = {};

        if (brandId) {
            where.brandId = brandId;
        }

        if (model) {
            where.model = Like(`%${model}%`);
        }

        if (minWattage !== undefined && maxWattage !== undefined) {
            where.wattage = Between(minWattage, maxWattage);
        } else if (minWattage !== undefined) {
            where.wattage = MoreThanOrEqual(minWattage);
        } else if (maxWattage !== undefined) {
            where.wattage = LessThanOrEqual(maxWattage);
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

        const result = await this.solarPanelRepository.find(
            where,
            page,
            limit,
            ['brand'],
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

    async findOne(id: string): Promise<SolarPanel> {
        return this.solarPanelRepository.findOne({ id, isActive: true }, ['brand']);
    }

    async findByBrand(brandId: string): Promise<SolarPanel[]> {
        const result = await this.solarPanelRepository.find({ brandId, isActive: true }, undefined, undefined, ['brand']);
        return result.data;
    }

    async update(id: string, updateSolarPanelDto: UpdateSolarPanelDto): Promise<SolarPanel> {
        // Verify entity exists
        await this.findOne(id);

        if (updateSolarPanelDto.brandId) {
            await this.brandService.findOne(updateSolarPanelDto.brandId);
        }

        // Only include defined values to prevent overwriting with undefined
        const updateData = Object.fromEntries(
            Object.entries(updateSolarPanelDto).filter(([_, value]) => value !== undefined)
        );

        return this.solarPanelRepository.findOneAndUpdate({ id }, updateData) as Promise<SolarPanel>;
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.solarPanelRepository.findOneAndUpdate({ id }, { isActive: false });
    }
}

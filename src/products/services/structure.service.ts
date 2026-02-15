import { Injectable, NotFoundException } from '@nestjs/common';
import { StructureRepository } from '../repositories/structure.repository';
import { Structure, StructureType } from '../entities/structure.entity';
import { CreateStructureDto, UpdateStructureDto, FilterStructureDto } from '../dto';

@Injectable()
export class StructureService {
    constructor(private readonly structureRepository: StructureRepository) { }

    async create(createStructureDto: CreateStructureDto): Promise<Structure> {
        return this.structureRepository.createEntity(createStructureDto) as Promise<Structure>;
    }

    async findAll(filterDto: FilterStructureDto) {
        const { type, isActive, page = 1, limit = 10 } = filterDto;
        const where: any = {};

        if (type) {
            where.type = type;
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        const result = await this.structureRepository.find(
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

    async findOne(id: string): Promise<Structure> {
        return this.structureRepository.findOne({ id, isActive: true });
    }

    async findByType(type: StructureType): Promise<Structure[]> {
        const result = await this.structureRepository.find({ type, isActive: true });
        return result.data;
    }

    async update(id: string, updateStructureDto: UpdateStructureDto): Promise<Structure> {
        await this.findOne(id);
        const updateData = Object.fromEntries(
            Object.entries(updateStructureDto).filter(([_, value]) => value !== undefined)
        );
        return this.structureRepository.findOneAndUpdate({ id }, updateData) as Promise<Structure>;
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.structureRepository.findOneAndUpdate({ id }, { isActive: false });
    }
}

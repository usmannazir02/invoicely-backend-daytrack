import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { BrandService } from '../services/brand.service';
import { CreateBrandDto, UpdateBrandDto, FilterBrandDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { generateResponse } from '../../lib/common/utils/response.helper';
import { BrandType } from '../entities/brand.entity';

@Controller('brands')
@UseGuards(JwtAuthGuard)
export class BrandController {
    constructor(private readonly brandService: BrandService) { }

    @Post()
    async create(@Body() createBrandDto: CreateBrandDto, @Res() res: Response) {
        const brand = await this.brandService.create(createBrandDto);
        return generateResponse(brand, 'Brand created successfully', res, 201);
    }

    @Get()
    async findAll(@Query() filterDto: FilterBrandDto, @Res() res: Response) {
        const result = await this.brandService.findAll(filterDto);
        return generateResponse(result, 'Brands retrieved successfully', res);
    }

    @Get('type/:type')
    async findByType(@Param('type') type: BrandType, @Res() res: Response) {
        const brands = await this.brandService.findByType(type);
        return generateResponse(brands, 'Brands retrieved successfully', res);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const brand = await this.brandService.findOne(id);
        return generateResponse(brand, 'Brand retrieved successfully', res);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateBrandDto: UpdateBrandDto,
        @Res() res: Response,
    ) {
        const brand = await this.brandService.update(id, updateBrandDto);
        return generateResponse(brand, 'Brand updated successfully', res);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        await this.brandService.remove(id);
        return generateResponse(null, 'Brand deleted successfully', res);
    }
}

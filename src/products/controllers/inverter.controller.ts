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
import { InverterService } from '../services/inverter.service';
import { CreateInverterDto, UpdateInverterDto, FilterInverterDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { generateResponse } from '../../lib/common/utils/response.helper';

@Controller('inverters')
@UseGuards(JwtAuthGuard)
export class InverterController {
    constructor(private readonly inverterService: InverterService) { }

    @Post()
    async create(@Body() createInverterDto: CreateInverterDto, @Res() res: Response) {
        const inverter = await this.inverterService.create(createInverterDto);
        return generateResponse(inverter, 'Inverter created successfully', res, 201);
    }

    @Get()
    async findAll(@Query() filterDto: FilterInverterDto, @Res() res: Response) {
        const result = await this.inverterService.findAll(filterDto);
        return generateResponse(result, 'Inverters retrieved successfully', res);
    }

    @Get('brand/:brandId')
    async findByBrand(@Param('brandId') brandId: string, @Res() res: Response) {
        const inverters = await this.inverterService.findByBrand(brandId);
        return generateResponse(inverters, 'Inverters retrieved successfully', res);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const inverter = await this.inverterService.findOne(id);
        return generateResponse(inverter, 'Inverter retrieved successfully', res);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateInverterDto: UpdateInverterDto,
        @Res() res: Response,
    ) {
        const inverter = await this.inverterService.update(id, updateInverterDto);
        return generateResponse(inverter, 'Inverter updated successfully', res);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        await this.inverterService.remove(id);
        return generateResponse(null, 'Inverter deleted successfully', res);
    }
}

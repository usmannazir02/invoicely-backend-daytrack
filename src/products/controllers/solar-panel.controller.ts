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
import { SolarPanelService } from '../services/solar-panel.service';
import { CreateSolarPanelDto, UpdateSolarPanelDto, FilterSolarPanelDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { generateResponse } from '../../lib/common/utils/response.helper';

@Controller('solar-panels')
@UseGuards(JwtAuthGuard)
export class SolarPanelController {
    constructor(private readonly solarPanelService: SolarPanelService) { }

    @Post()
    async create(@Body() createSolarPanelDto: CreateSolarPanelDto, @Res() res: Response) {
        const solarPanel = await this.solarPanelService.create(createSolarPanelDto);
        return generateResponse(solarPanel, 'Solar Panel created successfully', res, 201);
    }

    @Get()
    async findAll(@Query() filterDto: FilterSolarPanelDto, @Res() res: Response) {
        const result = await this.solarPanelService.findAll(filterDto);
        return generateResponse(result, 'Solar Panels retrieved successfully', res);
    }

    @Get('brand/:brandId')
    async findByBrand(@Param('brandId') brandId: string, @Res() res: Response) {
        const solarPanels = await this.solarPanelService.findByBrand(brandId);
        return generateResponse(solarPanels, 'Solar Panels retrieved successfully', res);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const solarPanel = await this.solarPanelService.findOne(id);
        return generateResponse(solarPanel, 'Solar Panel retrieved successfully', res);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateSolarPanelDto: UpdateSolarPanelDto,
        @Res() res: Response,
    ) {
        const solarPanel = await this.solarPanelService.update(id, updateSolarPanelDto);
        return generateResponse(solarPanel, 'Solar Panel updated successfully', res);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        await this.solarPanelService.remove(id);
        return generateResponse(null, 'Solar Panel deleted successfully', res);
    }
}

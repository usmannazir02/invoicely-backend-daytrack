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
import { MiscItemService } from '../services/misc-item.service';
import { CreateMiscItemDto, UpdateMiscItemDto, FilterMiscItemDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { generateResponse } from '../../lib/common/utils/response.helper';
import { MiscItemType } from '../entities/misc-item.entity';

@Controller('misc-items')
@UseGuards(JwtAuthGuard)
export class MiscItemController {
    constructor(private readonly miscItemService: MiscItemService) { }

    @Post()
    async create(@Body() createMiscItemDto: CreateMiscItemDto, @Res() res: Response) {
        const miscItem = await this.miscItemService.create(createMiscItemDto);
        return generateResponse(miscItem, 'Misc Item created successfully', res, 201);
    }

    @Get()
    async findAll(@Query() filterDto: FilterMiscItemDto, @Res() res: Response) {
        const result = await this.miscItemService.findAll(filterDto);
        return generateResponse(result, 'Misc Items retrieved successfully', res);
    }

    @Get('type/:type')
    async findByType(@Param('type') type: MiscItemType, @Res() res: Response) {
        const miscItems = await this.miscItemService.findByType(type);
        return generateResponse(miscItems, 'Misc Items retrieved successfully', res);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const miscItem = await this.miscItemService.findOne(id);
        return generateResponse(miscItem, 'Misc Item retrieved successfully', res);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateMiscItemDto: UpdateMiscItemDto,
        @Res() res: Response,
    ) {
        const miscItem = await this.miscItemService.update(id, updateMiscItemDto);
        return generateResponse(miscItem, 'Misc Item updated successfully', res);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        await this.miscItemService.remove(id);
        return generateResponse(null, 'Misc Item deleted successfully', res);
    }
}

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
import { ElectricalItemService } from '../services/electrical-item.service';
import { CreateElectricalItemDto, UpdateElectricalItemDto, FilterElectricalItemDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { generateResponse } from '../../lib/common/utils/response.helper';

@Controller('electrical-items')
@UseGuards(JwtAuthGuard)
export class ElectricalItemController {
  constructor(private readonly electricalItemService: ElectricalItemService) {}

  @Post()
  async create(@Body() createElectricalItemDto: CreateElectricalItemDto, @Res() res: Response) {
    const item = await this.electricalItemService.create(createElectricalItemDto);
    return generateResponse(item, 'Electrical Item created successfully', res, 201);
  }

  @Get()
  async findAll(@Query() filterDto: FilterElectricalItemDto, @Res() res: Response) {
    const result = await this.electricalItemService.findAll(filterDto);
    return generateResponse(result, 'Electrical Items retrieved successfully', res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const item = await this.electricalItemService.findOne(id);
    return generateResponse(item, 'Electrical Item retrieved successfully', res);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateElectricalItemDto: UpdateElectricalItemDto, @Res() res: Response) {
    const item = await this.electricalItemService.update(id, updateElectricalItemDto);
    return generateResponse(item, 'Electrical Item updated successfully', res);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.electricalItemService.remove(id);
    return generateResponse(null, 'Electrical Item deleted successfully', res);
  }
}

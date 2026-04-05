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
import { ServiceItemService } from '../services/service-item.service';
import { CreateServiceItemDto, UpdateServiceItemDto, FilterServiceItemDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { generateResponse } from '../../lib/common/utils/response.helper';

@Controller('service-items')
@UseGuards(JwtAuthGuard)
export class ServiceItemController {
  constructor(private readonly serviceItemService: ServiceItemService) {}

  @Post()
  async create(@Body() createServiceItemDto: CreateServiceItemDto, @Res() res: Response) {
    const item = await this.serviceItemService.create(createServiceItemDto);
    return generateResponse(item, 'Service Item created successfully', res, 201);
  }

  @Get()
  async findAll(@Query() filterDto: FilterServiceItemDto, @Res() res: Response) {
    const result = await this.serviceItemService.findAll(filterDto);
    return generateResponse(result, 'Service Items retrieved successfully', res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const item = await this.serviceItemService.findOne(id);
    return generateResponse(item, 'Service Item retrieved successfully', res);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateServiceItemDto: UpdateServiceItemDto, @Res() res: Response) {
    const item = await this.serviceItemService.update(id, updateServiceItemDto);
    return generateResponse(item, 'Service Item updated successfully', res);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.serviceItemService.remove(id);
    return generateResponse(null, 'Service Item deleted successfully', res);
  }
}

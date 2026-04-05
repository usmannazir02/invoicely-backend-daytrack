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
import { BatteryService } from '../services/battery.service';
import { CreateBatteryDto, UpdateBatteryDto, FilterBatteryDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { generateResponse } from '../../lib/common/utils/response.helper';

@Controller('batteries')
@UseGuards(JwtAuthGuard)
export class BatteryController {
  constructor(private readonly batteryService: BatteryService) {}

  @Post()
  async create(@Body() createBatteryDto: CreateBatteryDto, @Res() res: Response) {
    const battery = await this.batteryService.create(createBatteryDto);
    return generateResponse(battery, 'Battery created successfully', res, 201);
  }

  @Get()
  async findAll(@Query() filterDto: FilterBatteryDto, @Res() res: Response) {
    const result = await this.batteryService.findAll(filterDto);
    return generateResponse(result, 'Batteries retrieved successfully', res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const battery = await this.batteryService.findOne(id);
    return generateResponse(battery, 'Battery retrieved successfully', res);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBatteryDto: UpdateBatteryDto, @Res() res: Response) {
    const battery = await this.batteryService.update(id, updateBatteryDto);
    return generateResponse(battery, 'Battery updated successfully', res);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.batteryService.remove(id);
    return generateResponse(null, 'Battery deleted successfully', res);
  }
}

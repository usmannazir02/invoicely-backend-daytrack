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
import { StructureService } from '../services/structure.service';
import {
  CreateStructureDto,
  UpdateStructureDto,
  FilterStructureDto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { generateResponse } from '../../lib/common/utils/response.helper';
import { StructureType } from '../entities/structure.entity';

@Controller('structures')
@UseGuards(JwtAuthGuard)
export class StructureController {
  constructor(private readonly structureService: StructureService) {}

  @Post()
  async create(
    @Body() createStructureDto: CreateStructureDto,
    @Res() res: Response,
  ) {
    const structure = await this.structureService.create(createStructureDto);
    return generateResponse(
      structure,
      'Structure created successfully',
      res,
      201,
    );
  }

  @Get()
  async findAll(@Query() filterDto: FilterStructureDto, @Res() res: Response) {
    const result = await this.structureService.findAll(filterDto);
    return generateResponse(result, 'Structures retrieved successfully', res);
  }

  @Get('type/:type')
  async findByType(@Param('type') type: StructureType, @Res() res: Response) {
    const structures = await this.structureService.findByType(type);
    return generateResponse(
      structures,
      'Structures retrieved successfully',
      res,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const structure = await this.structureService.findOne(id);
    return generateResponse(structure, 'Structure retrieved successfully', res);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStructureDto: UpdateStructureDto,
    @Res() res: Response,
  ) {
    const structure = await this.structureService.update(
      id,
      updateStructureDto,
    );
    return generateResponse(structure, 'Structure updated successfully', res);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.structureService.remove(id);
    return generateResponse(null, 'Structure deleted successfully', res);
  }
}

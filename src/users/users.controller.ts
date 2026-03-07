import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { Request } from 'express';
import type { Response } from 'express';
import { generateResponse } from '../lib/common/utils/response.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../lib/common/enums/roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request, @Res() res: Response) {
    const authUser = req.user as { id?: string } | undefined;
    const userId = authUser?.id;

    const user = userId ? await this.usersService.findById(userId) : null;

    return generateResponse(user, 'Profile retrieved successfully', res);
  }

  @Post('sales')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createSalesAgent(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    createUserDto.role = UserRole.SALES;
    const user = await this.usersService.createUser(createUserDto);
    return generateResponse(user, 'Sales agent created successfully', res, 201);
  }

  @Get('sales')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getSalesAgents(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('roleFilter') roleFilter: 'SALES' | 'ADMIN' | 'BOTH',
    @Res() res: Response,
  ) {
    const agents = await this.usersService.findAllSalesAgents(
      page || 1,
      limit || 10,
      roleFilter || 'SALES'
    );
    return generateResponse(
      agents,
      'Sales agents retrieved successfully',
      res,
    );
  }
  @Patch('sales/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateSalesAgent(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.usersService.updateSalesAgent(id, updateUserDto);
    return generateResponse(user, 'Sales agent updated successfully', res);
  }

  @Delete('sales/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteSalesAgent(@Param('id') id: string, @Res() res: Response) {
    await this.usersService.softDeleteSalesAgent(id);
    return generateResponse(null, 'Sales agent deleted successfully', res);
  }
}

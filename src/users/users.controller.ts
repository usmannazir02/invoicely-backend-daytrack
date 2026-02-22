import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import type { Response } from 'express';
import { generateResponse } from '../lib/common/utils/response.helper';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request, @Res() res: Response) {
    const authUser = req.user as { id?: string } | undefined;
    const userId = authUser?.id;

    const user = userId ? await this.usersService.findById(userId) : null;

    return generateResponse(user, 'Profile retrieved successfully', res);
  }
}

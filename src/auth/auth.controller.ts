import { Controller, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { generateResponse } from '../lib/common/utils/response.helper';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const result = await this.authService.login(loginDto);
        return generateResponse(result, 'Login successful', res, HttpStatus.OK);
    }
}

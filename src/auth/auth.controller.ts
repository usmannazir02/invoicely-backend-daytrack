import { Controller, Post, Body, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { generateResponse } from '../lib/common/utils/response.helper';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const result = await this.authService.login(loginDto);

        // Set JWT token in HTTP-only cookie
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // 'lax' allows cookie on same-site navigation (refresh)
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
        });

        return generateResponse(result, 'Login successful', res, HttpStatus.OK);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@Res() res: Response) {
        // Clear the access_token cookie
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return generateResponse(null, 'Logout successful', res, HttpStatus.OK);
    }
}

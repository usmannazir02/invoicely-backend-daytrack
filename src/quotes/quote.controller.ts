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
    Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { QuoteService } from './quote.service';
import { CreateQuoteDto, UpdateQuoteDto, FilterQuoteDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { generateResponse } from '../lib/common/utils/response.helper';
import { QuoteStatus } from './entities';

@Controller('quotes')
@UseGuards(JwtAuthGuard)
export class QuoteController {
    constructor(private readonly quoteService: QuoteService) { }

    @Post()
    async create(
        @Body() createQuoteDto: CreateQuoteDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const quote = await this.quoteService.create(createQuoteDto, req.user as any);
        return generateResponse(quote, 'Quote created successfully', res, 201);
    }

    @Get()
    async findAll(
        @Query() filterDto: FilterQuoteDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const result = await this.quoteService.findAll(filterDto, req.user as any);
        return generateResponse(result, 'Quotes retrieved successfully', res);
    }

    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const quote = await this.quoteService.findOne(id, req.user as any);
        return generateResponse(quote, 'Quote retrieved successfully', res);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateQuoteDto: UpdateQuoteDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const quote = await this.quoteService.update(id, updateQuoteDto, req.user as any);
        return generateResponse(quote, 'Quote updated successfully', res);
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: QuoteStatus,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const quote = await this.quoteService.updateStatus(id, status, req.user as any);
        return generateResponse(quote, 'Quote status updated successfully', res);
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.quoteService.remove(id, req.user as any);
        return generateResponse(null, 'Quote deleted successfully', res);
    }
}

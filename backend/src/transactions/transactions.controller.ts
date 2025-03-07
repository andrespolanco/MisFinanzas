import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode, Query} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.authguard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Request() req, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.id, createTransactionDto);
  }
  
  @Get()
  findAll(
    @Request() req,
    @Query("page") page: string,
    @Query("limit") limit: string
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.transactionsService.findAll(req.user.id, pageNumber, limitNumber);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.transactionsService.findOne(req.user.id ,id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(req.user.id, id, updateTransactionDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Request() req, @Param('id') id: string) {
    return this.transactionsService.remove(req.user.id, id);
  }

  @Get('current-month/expenses')
  getCurrentMonthExpenses(@Request() req) {
    return this.transactionsService.getCurrentMonthExpenses(req.user.id);
  }

  @Get('last-week/expenses')
  getLastWeekExpenses(@Request() req) {
    return this.transactionsService.getLastWeekExpenses(req.user.id);
  }

  @Get('previous-month/expenses')
  getPreviousMonthExpenses(@Request() req) {
    return this.transactionsService.getPreviousMonthExpenses(req.user.id);
  }

  @Get("/transactions-by-month/expenses")
  async getTransactionsByMonth(@Request() req) {
    return this.transactionsService.getTransactionsByMonth(req.user.id);
  }
}

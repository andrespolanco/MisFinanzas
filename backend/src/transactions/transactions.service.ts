import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PaymentMethod, Transaction } from './entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { toZonedTime } from 'date-fns-tz';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths } from 'date-fns';

@Injectable()
export class TransactionsService {
  private readonly timeZone = 'Etc/GMT+10'; // Definir zona horaria

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
    
  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const category = await this.categoryRepository.findOne({
      where: { id: createTransactionDto.categoryId },
    });
    if (!category) {
      throw new Error('Categoría no encontrada');
    }
    const paymentMethod = createTransactionDto.paymentMethod as PaymentMethod;
    const transactionDate = createTransactionDto.date
        ? new Date(createTransactionDto.date)  // Si la fecha se pasó en el request
        : this.timeZone;  // Si no se pasó la fecha, usamos la fecha local
    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      date: transactionDate,
      user, // Aquí pasamos el objeto `User`, no el `userId`
      category,
      paymentMethod,
    });
    return this.transactionsRepository.save(transaction);
  }

  async findAll(userId: string, page: number = 1, limit: number = 10) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
  
    // Calculamos el `skip`
    const skip = (page - 1) * limit;
  
    // Buscamos las transacciones con paginación
    const [transactions, total] = await this.transactionsRepository.findAndCount({
      where: { user },
      relations: ["user", "category"],
      order: { date: "DESC" }, // Ordenamos por fecha descendente
      take: limit, // Cantidad de registros por página
      skip: skip, // Cuántos registros saltar
    });
  
    return {
      data: transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  async findOne(userId: string, id: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const transaction = await this.transactionsRepository.findOne({
        where: { id, user: { id: userId } },  // Filtra por ID de transacción y usuario
        relations: ['user', 'category'],
    });
    if (!transaction) {
        throw new NotFoundException('Transacción no encontrada');
    }
    return { ...transaction };
  }

  async update(userId: string, id: string, updateTransactionDto: UpdateTransactionDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
        throw new Error('Usuario no encontrado'); // Manejo de error si el usuario no existe
    }
    const transaction = await this.findOne(userId, id);
    Object.assign(transaction, updateTransactionDto);
    return this.transactionsRepository.save(transaction);
  }

  async remove(userId: string, id: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Usuario no encontrado'); // Manejo de error si el usuario no existe
    }
    const transaction = await this.findOne(userId, id);
    return this.transactionsRepository.remove(transaction);
  }

  async getCurrentMonthExpenses(userId: string) {
    const now = new Date();
    const startDate = toZonedTime(startOfMonth(now), this.timeZone);
    const endDate = toZonedTime(endOfMonth(now), this.timeZone);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    // Obtener transacciones del mes
    const transactions = await this.getTransactionsByDateRange(userId, startDate, endDate);
    // Filtrar ingresos y gastos
    const incomeTransactions = transactions.filter(tx => tx.category.name === "Ingresos");
    const expenseTransactions = transactions.filter(tx => tx.category.name !== "Ingresos");
    // Calcular totales
    const totalIncomes = incomeTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
    const totalExpenses = expenseTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
    return { totalExpenses, totalIncomes, transactions }; // Devolvemos la suma junto con las transacciones
  }

  async getLastWeekExpenses(userId: string) {
    const now = new Date();
    const startDate = toZonedTime(startOfWeek(now, { weekStartsOn: 1 }), this.timeZone); // Lunes
    const endDate = toZonedTime(endOfWeek(now, { weekStartsOn: 1 }), this.timeZone); // Domingo
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const transactions = await this.getTransactionsByDateRange(userId, startDate, endDate);
    // Filtrar ingresos y gastos
    const incomeTransactions = transactions.filter(tx => tx.category.name === "Ingresos");
    const expenseTransactions = transactions.filter(tx => tx.category.name !== "Ingresos");
    // Calcular totales
    const totalIncomes = incomeTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
    const totalExpenses = expenseTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
    return { totalExpenses, totalIncomes, transactions }; // Devolvemos la suma junto con las transacciones
  }

  async getPreviousMonthExpenses(userId: string) {
    const now = new Date();
    const startDate = toZonedTime(startOfMonth(subMonths(now, 1)), this.timeZone);
    const endDate = toZonedTime(endOfMonth(subMonths(now, 1)), this.timeZone);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const transactions = await this.getTransactionsByDateRange(userId, startDate, endDate);
    // Filtrar ingresos y gastos
    const incomeTransactions = transactions.filter(tx => tx.category.name === "Ingresos");
    const expenseTransactions = transactions.filter(tx => tx.category.name !== "Ingresos");
    // Calcular totales
    const totalIncomes = incomeTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
    const totalExpenses = expenseTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
    return { totalExpenses, totalIncomes, transactions }; // Devolvemos la suma junto con las transacciones
  }

  async getTransactionsByMonth(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
  
    const transactions = await this.transactionsRepository
      .createQueryBuilder("transaction")
      .select("DATE_TRUNC('month', transaction.date)", "month")
      .addSelect("SUM(transaction.amount)", "total")
      .where("transaction.userId = :userId", { userId })
      .groupBy("month")
      .orderBy("month", "ASC")
      .getRawMany();
  
    return transactions.map((t) => ({
      name: new Date(t.month).toLocaleString("default", { month: "short" }),
      total: Number(t.total),
    }));
  }

  private async getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date) {
    return this.transactionsRepository.find({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate),
      },
      order: { date: 'DESC' },
      relations: ['category'],
    });
  }
}

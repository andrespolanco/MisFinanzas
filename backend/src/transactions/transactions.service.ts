import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { toZonedTime } from 'date-fns-tz';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PaymentMethod, Transaction } from './entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class TransactionsService {
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
      throw new Error('Usuario no encontrado'); // Manejo de error si el usuario no existe
    }
    const category = await this.categoryRepository.findOne({
      where: { id: createTransactionDto.categoryId },
    });
    if (!category) {
      throw new Error('Categoría no encontrada');
    }
    const paymentMethod = createTransactionDto.paymentMethod as PaymentMethod;
    //const peruDate = toZonedTime(new Date(), 'Etc/GMT+10');
    // Si no se ha proporcionado una fecha en el request, usamos la fecha local de Perú
    const transactionDate = createTransactionDto.date
        ? new Date(createTransactionDto.date)  // Si la fecha se pasó en el request
        : toZonedTime(new Date(), 'Etc/GMT+10');  // Si no se pasó la fecha, usamos la fecha local
    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      date: transactionDate,
      user, // Aquí pasamos el objeto `User`, no el `userId`
      category,
      paymentMethod,
    });
    return this.transactionsRepository.save(transaction);
  }

  async findAll(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
        throw new Error('Usuario no encontrado'); // Manejo de error si el usuario no existe
    }
    return this.transactionsRepository.find({ where: { user } , relations: ['user', 'category'] });
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
}

import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { PaymentMethod } from '../entities/transaction.entity';

export class CreateTransactionDto {
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    amount: number;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsUUID()
    categoryId: string;
  
    @IsEnum(PaymentMethod)
    @IsOptional()
    paymentMethod?: string;

    @IsDate()
    @IsOptional()
    date?: Date;
}

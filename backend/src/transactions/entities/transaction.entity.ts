import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";

export enum PaymentMethod {
    CASH = 'EFECTIVO',
    CARD_IBK = 'TARJETA IBK',
    CARD_BCP = 'TARJETA BCP',
    YAPE = 'YAPE',
    PLIN = 'PLIN',
    AGORA = 'AGORA',
  }

@Entity('transactions')  // Nombre de la tabla
export class Transaction {
    @PrimaryGeneratedColumn('uuid')  // Se recomienda UUID en lugar de ID numérico
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })  // Monto con 2 decimales
    amount: number;
    
    @Column({ type: 'text', nullable: true })  // Descripción opcional
    description?: string;
    
    @CreateDateColumn()  // Se autogenera la fecha de creación
    date: Date;

    @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH })
    paymentMethod: PaymentMethod;
    
    @ManyToOne(() => User, (user) => user.transactions, { eager: false, onDelete: 'CASCADE' })
    user: User;
    
    @ManyToOne(() => Category, (category) => category.transactions, { eager: false, onDelete: 'SET NULL', nullable: true })
    category: Category;
}

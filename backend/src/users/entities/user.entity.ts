import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Transaction } from "../../transactions/entities/transaction.entity";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
  }

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
    
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions: Transaction[];
}

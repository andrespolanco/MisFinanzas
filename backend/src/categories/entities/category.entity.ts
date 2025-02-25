import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Transaction } from "src/transactions/entities/transaction.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @OneToMany(() => Transaction, (transaction) => transaction.category)
    transactions: Transaction[];
}

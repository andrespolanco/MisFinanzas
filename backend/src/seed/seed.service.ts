import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';
import { Transaction, PaymentMethod} from '../transactions/entities/transaction.entity';

const seedCategories = [
  { name: 'Vivienda', description: 'Gastos relacionados con alquiler, hipoteca, servicios básicos y mantenimiento del hogar.' },
  { name: 'Alimentación', description: 'Compras de supermercado, restaurantes, comida rápida y delivery.' },
  { name: 'Transporte', description: 'Gastos en gasolina, transporte público, taxis, Uber y mantenimiento del vehículo.' },
  { name: 'Suscripciones', description: 'Pagos recurrentes de servicios como Netflix, Spotify, iCloud, Amazon Prime, entre otros.' },
  { name: 'Salud', description: 'Consultas médicas, compra de medicinas, seguros de salud y tratamientos.' },
  { name: 'Entretenimiento', description: 'Gastos en cine, videojuegos, conciertos, actividades recreativas y hobbies.' },
  { name: 'Compras personales', description: 'Adquisición de ropa, gadgets, accesorios y otros productos personales.' },
  { name: 'Regalos y donaciones', description: 'Compras de regalos, donaciones a organizaciones benéficas o ayuda a terceros.' },
  { name: 'Educación', description: 'Inversión en cursos, libros, membresías de aprendizaje y material educativo.' },
  { name: 'Fitness', description: 'Gastos en gimnasio, suplementos, equipamiento deportivo y entrenamientos.' },
  { name: 'Deudas y Finanzas', description: 'Pago de tarjetas de crédito, préstamos, inversiones y comisiones bancarias.' },
  { name: 'Ingresos', description: 'Ingreso de fondos, sueldos, pagos y deudas' },
];

const seedUsers = [
  {"name": "Jose Polanco", "email": "josepolancog20@gmail.com", "password": "mypass"},
  {"name": "María López", "email": "maria.lopez@example.com", "password": "securepass123"},
  {"name": "Carlos Fernández", "email": "carlos.fernandez@example.com", "password": "password456"},
  {"name": "Ana González", "email": "ana.gonzalez@example.com", "password": "anapass789"},
  {"name": "Luis Rodríguez", "email": "luis.rodriguez@example.com", "password": "luispass321"},
  {"name": "Sofía Méndez", "email": "sofia.mendez@example.com", "password": "sofiamendez555"},
  {"name": "Daniel Torres", "email": "daniel.torres@example.com", "password": "danieltpass777"},
  {"name": "Elena Castro", "email": "elena.castro@example.com", "password": "elenaCastro888"},
  {"name": "Fernando Ruiz", "email": "fernando.ruiz@example.com", "password": "fernandopass999"},
  {"name": "Gabriela Vargas", "email": "gabriela.vargas@example.com", "password": "gabysecure222"}
];

const seedTransactions = [
  { amount: 150.75, description: 'Compra en supermercado', date: new Date('2025-03-05T10:30:00.000Z'), categoryName: 'Alimentación', userEmail: 'josepolancog20@gmail.com', paymentMethod: PaymentMethod.CASH },
  { amount: 50.0, description: 'Suscripción Netflix', date: new Date('2025-03-01T00:00:00.000Z'), categoryName: 'Suscripciones', userEmail: 'josepolancog20@gmail.com', paymentMethod: PaymentMethod.CARD_IBK },
  ...Array.from({ length: 58 }, (_, i) => {
    const day = (i % 28) + 1; // Asegurar que el día esté entre 1 y 28
    const month = i % 2 === 0 ? '03' : '02'; // Alternando entre marzo y febrero
    const dateStr = `2025-${month}-${day.toString().padStart(2, '0')}T12:00:00.000Z`;
    
    return {
      amount: Math.floor(Math.random() * 200) + 10, // Monto aleatorio entre 10 y 210
      description: `Compra aleatoria ${i + 3}`,
      date: new Date(dateStr), // Convertir en objeto Date
      categoryName: ['Alimentación', 'Transporte', 'Entretenimiento', 'Educación', 'Ingresos'][i % 5],
      userEmail: 'usuario1@gmail.com',
      paymentMethod: Object.values(PaymentMethod)[i % Object.values(PaymentMethod).length],
    };
  })
].filter(t => !isNaN(t.date.getTime())); // Filtrar fechas inválidas

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async seedCategories() {
    for (const categoryData of seedCategories) {
      const existingCategory = await this.categoryRepository.findOne({ where: { name: categoryData.name } });

      if (!existingCategory) {
        const newCategory = this.categoryRepository.create(categoryData);
        await this.categoryRepository.save(newCategory);
      }
    }

    for (const userData of seedUsers) {
      const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });

      if (!existingUser) {
        const newUser = this.userRepository.create(userData);
        await this.userRepository.save(newUser);
      }
    }

    for (const transactionData of seedTransactions) {
      const user = await this.userRepository.findOne({ where: { email: transactionData.userEmail } });
      const category = await this.categoryRepository.findOne({ where: { name: transactionData.categoryName } });
  
      if (user && category) {
        const newTransaction = this.transactionRepository.create({
          amount: transactionData.amount,
          description: transactionData.description,
          date: transactionData.date,
          paymentMethod: transactionData.paymentMethod,
          user,
          category,
        });
  
        await this.transactionRepository.save(newTransaction);
      }
    }
    return { message: 'Categorías insertadas correctamente' };
  }
}
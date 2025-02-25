import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Importa la entidad User
  ],
  exports: [TypeOrmModule], // Opcional: si necesitas usar el repositorio en otros módulos
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule{}
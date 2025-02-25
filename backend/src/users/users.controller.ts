import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request as req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/auth/strategies/roles.guard';
import { Roles } from 'src/auth/strategies/roles.decorator';
import { UserRole } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.authguard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findOne(id); // Llama al método findOne del servicio
  }

  @Post('admin-action')
  @UseGuards(RolesGuard) // 👈 Aplica el guard a este endpoint
  @Roles(UserRole.ADMIN) // 👈 Solo para admins
  async adminAction(@req() request: Request) {
    return { message: 'Solo los admins pueden ver esto' };
  }
  
}

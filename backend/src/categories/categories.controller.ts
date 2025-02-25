import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RolesGuard } from 'src/auth/strategies/roles.guard';
import { UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/strategies/roles.decorator';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.authguard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  
  @Post()
  @UseGuards(RolesGuard) // 👈 Aplica el guard a este endpoint
  @Roles(UserRole.ADMIN) // 👈 Solo para admins
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }


  @Patch(':id')
  @UseGuards(RolesGuard) // 👈 Aplica el guard a este endpoint
  @Roles(UserRole.ADMIN) // 👈 Solo para admins
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(RolesGuard) // 👈 Aplica el guard a este endpoint
  @Roles(UserRole.ADMIN) // 👈 Solo para admins
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}

import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) // Inyecta el repositorio de User
    private usersRepository: Repository<User>, 
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string): Promise<User> {
    // Primero verificamos si el correo ya está registrado
    const existingUser = await this.usersRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new HttpException('El correo electrónico ya está registrado', HttpStatus.BAD_REQUEST);
    }

    // Si no existe, continuamos con la creación del nuevo usuario
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash de la contraseña
      const user = this.usersRepository.create({ name, email, password: hashedPassword });
      return await this.usersRepository.save(user);
    } catch (error) {
      // Aquí puedes capturar errores inesperados y lanzarlos
      throw new HttpException('Error al registrar el usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { sub: user.id, role: user.role };
      return this.jwtService.sign(payload); // Genera un JWT
    }
    // Si las credenciales son incorrectas, lanzar un error
    throw new UnauthorizedException('Credenciales inválidas');
  }

  
  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      // Lanzamos una excepción de usuario no encontrado
      throw new NotFoundException('Usuario no encontrado');
    }
      // Verificar si la nueva contraseña es igual a la actual
    if (updatePasswordDto.oldPassword === updatePasswordDto.newPassword) {
      throw new BadRequestException('La nueva contraseña no puede ser la misma que la anterior');
    }
    // Comprobar la contraseña actual
    const isMatch = await bcrypt.compare(updatePasswordDto.oldPassword, user.password);
    if (!isMatch) {
      // Lanzamos una excepción de contraseña incorrecta (sin revelar detalles)
      throw new UnauthorizedException('La contraseña actual no es correcta');
    }
    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    // Actualizar la contraseña en la base de datos
    user.password = hashedPassword;
    await this.usersRepository.save(user);
    // Mensaje de éxito (el mensaje puede personalizarse o dejarse vacío si lo prefieres)
    return { message: 'Contraseña actualizada con éxito' };
  }
}
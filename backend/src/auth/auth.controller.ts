import { Controller, Post, Body, Req, Patch, UseGuards, Res, HttpCode, Get} from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.authguard';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(name, email, password);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    const token = await this.authService.login(email, password);
    res.cookie('token', token, {
      httpOnly: true,   // Protección contra XSS
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: 'strict', // Protección contra CSRF
      maxAge: 60 * 60 * 1000, // Expira en 1 hora
    });
    //return { token };
    return res.send({ message: 'Login exitoso' });
  }

  @Get('validate-session')
  @UseGuards(JwtAuthGuard) // Protege la ruta
  validateSession(@Req() req: Request, @Res() res: Response) {
    return res.json({ user: req.user });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token', { path: '/' }); // Borra la cookie del token
    return res.status(200).json({ message: 'Sesión cerrada' });
  }

  @Patch('update-password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Req() request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId =  request.user.id;
    return this.authService.updatePassword(userId, updatePasswordDto);
  }
}
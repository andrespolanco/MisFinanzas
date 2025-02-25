import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from 'src/users/entities/user.entity';
import { Request } from 'express';

//jwt.strategy.ts → Configura passport-jwt para extraer y validar el token JWT.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.token,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string; role: UserRole }) {
    console.log('JwtStrategy validate:', { id: payload.sub, role: payload.role });
    return { id: payload.sub, role: payload.role}; // Asegurar que el ID esté aquí
  }
}
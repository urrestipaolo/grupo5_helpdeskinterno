import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import type { Request } from 'express';
import { Rol } from '../../generated/prisma/enums.js';

export interface UsuarioActualPayload {
  id: number;
  email: string;
  rol: Rol;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: UsuarioActualPayload }>();

    // Espera el header "Authorization: Bearer <token>"
    const [tipo, token] = request.headers.authorization?.split(' ') ?? [];
    if (tipo !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const payload = jwt.verify(
        token,
        this.config.getOrThrow<string>('JWT_SECRET'),
      ) as jwt.JwtPayload;

      request.user = {
        id: Number(payload.sub),
        email: payload.email as string,
        rol: payload.rol as Rol,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
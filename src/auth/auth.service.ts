import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { Rol } from '../generated/prisma/enums.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

// Lo que se devuelve de un usuario: nunca la contraseña
const selectPerfil = {
  id: true,
  nombre: true,
  email: true,
  rol: true,
  activo: true,
  creadoEn: true,
} satisfies Prisma.UsuarioSelect;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async registrar(dto: RegisterDto) {
    const existe = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existe) throw new ConflictException('El correo ya está registrado');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        email: dto.email,
        password: passwordHash,
        rol: Rol.EMPLEADO, // el registro público SIEMPRE crea empleados
      },
      select: selectPerfil,
    });
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email: dto.email } });

    // Mismo mensaje si falla el email, la contraseña o si está inactivo
    if (!usuario || !usuario.activo || !(await bcrypt.compare(dto.password, usuario.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const accessToken = jwt.sign(
      { sub: usuario.id, email: usuario.email, rol: usuario.rol },
      this.config.getOrThrow<string>('JWT_SECRET'),
      { expiresIn: this.config.get('JWT_EXPIRES_IN', '8h') as jwt.SignOptions['expiresIn'] },
    );

    return {
      access_token: accessToken,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    };
  }

  async perfil(id: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id }, select: selectPerfil });
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('El usuario ya no está activo');
    }
    return usuario;
  }
}
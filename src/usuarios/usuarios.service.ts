import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: {
        email: createUsuarioDto.email,
      },
    });

    if (usuarioExistente) {
      throw new ConflictException('El correo ya está registrado');
    }

    const passwordHash = await bcrypt.hash(createUsuarioDto.password, 10);

    return this.prisma.usuario.create({
      data: {
        nombre: createUsuarioDto.nombre,
        email: createUsuarioDto.email,
        password: passwordHash,
        rol: createUsuarioDto.rol,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        creadoEn: true,
      },
    });
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        creadoEn: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        creadoEn: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id);

    if (updateUsuarioDto.email) {
      const usuarioConEmail = await this.prisma.usuario.findUnique({
        where: {
          email: updateUsuarioDto.email,
        },
      });

      if (usuarioConEmail && usuarioConEmail.id !== id) {
        throw new ConflictException('El correo ya está registrado');
      }
    }

    const data: any = {
      ...updateUsuarioDto,
    };

    if (updateUsuarioDto.password) {
      data.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }

    return this.prisma.usuario.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        creadoEn: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.usuario.update({
      where: {
        id,
      },
      data: {
        activo: false,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });
  }
}

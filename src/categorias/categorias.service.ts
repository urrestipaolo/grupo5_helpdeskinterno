import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async listar() {
    return this.prisma.categoria.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async buscarPorId(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return categoria;
  }

  async crear(dto: CreateCategoriaDto) {
    try {
      return await this.prisma.categoria.create({
        data: {
          nombre: dto.nombre,
          descripcion: dto.descripcion,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }

      throw error;
    }
  }

  async actualizar(id: number, dto: UpdateCategoriaDto) {
    await this.buscarPorId(id);

    try {
      return await this.prisma.categoria.update({
        where: { id },
        data: {
          ...(dto.nombre !== undefined && {
            nombre: dto.nombre,
          }),
          ...(dto.descripcion !== undefined && {
            descripcion: dto.descripcion,
          }),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }

      throw error;
    }
  }

  async eliminar(id: number) {
    await this.buscarPorId(id);

    const ticketsAsociados = await this.prisma.ticket.count({
      where: {
        categoriaId: id,
      },
    });

    if (ticketsAsociados > 0) {
      throw new ConflictException(
        'No se puede eliminar la categoría porque tiene tickets asociados',
      );
    }

    try {
      return await this.prisma.categoria.delete({
        where: { id },
      });
    } catch (error) {
      // Protege también frente a una asociación creada
      // entre la comprobación y la eliminación.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(
          'No se puede eliminar la categoría porque tiene tickets asociados',
        );
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
      }

      throw error;
    }
  }
}

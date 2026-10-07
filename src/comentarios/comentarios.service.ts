import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { Rol } from '../generated/prisma/enums.js';
import { CreateComentarioDto } from './dto/create-comentario.dto.js';

export interface UsuarioActualPayload {
  id: number;
  email: string;
  rol: Rol;
}

// Lo que se devuelve de cada comentario: el autor sin password
const selectComentario = {
  id: true,
  contenido: true,
  creadoEn: true,
  ticketId: true,
  autor: { select: { id: true, nombre: true, rol: true } },
} satisfies Prisma.ComentarioSelect;

@Injectable()
export class ComentariosService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(ticketId: number, usuario: UsuarioActualPayload, dto: CreateComentarioDto) {
    await this.verificarAcceso(ticketId, usuario);

    return this.prisma.comentario.create({
      data: {
        contenido: dto.contenido,
        ticketId,
        autorId: usuario.id, // el autor SIEMPRE sale del token
      },
      select: selectComentario,
    });
  }

  async listar(ticketId: number, usuario: UsuarioActualPayload) {
    await this.verificarAcceso(ticketId, usuario);

    return this.prisma.comentario.findMany({
      where: { ticketId },
      orderBy: { creadoEn: 'asc' }, // orden cronológico
      select: selectComentario,
    });
  }

  // Misma regla de visibilidad que los tickets:
  // ADMIN y AGENTE ven todos; un EMPLEADO solo los que creó.
  private async verificarAcceso(ticketId: number, usuario: UsuarioActualPayload) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true, creadorId: true },
    });

    const esAjeno = usuario.rol === Rol.EMPLEADO && ticket?.creadorId !== usuario.id;
    if (!ticket || esAjeno) {
      throw new NotFoundException(`Ticket con ID ${ticketId} no encontrado`);
    }
    return ticket;
  }
}
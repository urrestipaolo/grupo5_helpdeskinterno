import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { Rol } from '../generated/prisma/enums.js';
import { CreateComentarioDto } from './dto/create-comentario.dto.js';
import { NotificacionesService } from '../notificaciones/notificaciones.service.js';

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificaciones: NotificacionesService,
  ) {}

  async crear(ticketId: number, usuario: UsuarioActualPayload, dto: CreateComentarioDto) {
    const ticket = await this.verificarAcceso(ticketId, usuario);

    const comentario = await this.prisma.comentario.create({
      data: { contenido: dto.contenido, ticketId, autorId: usuario.id },
      select: selectComentario,
    });

    // Se notifica DESPUÉS de guardar: si el aviso falla, el comentario ya existe
    this.notificaciones.nuevoComentario(ticket, comentario);

    return comentario;
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
      // titulo y agenteId los necesita la notificación de comentario nuevo
      select: { id: true, titulo: true, creadorId: true, agenteId: true },
    });

    const esAjeno = usuario.rol === Rol.EMPLEADO && ticket?.creadorId !== usuario.id;
    if (!ticket || esAjeno) {
      throw new NotFoundException(`Ticket con ID ${ticketId} no encontrado`);
    }
    return ticket;
  }
}
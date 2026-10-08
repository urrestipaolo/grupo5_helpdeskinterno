import { Injectable, Logger } from '@nestjs/common';
import { EstadoTicket } from '../generated/prisma/enums.js';
import { NotificacionesGateway } from './notificaciones.gateway.js';

export interface TicketNotificable {
  id: number;
  titulo: string;
  creadorId: number;
  agenteId: number | null;
}

@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger(NotificacionesService.name);

  constructor(private readonly gateway: NotificacionesGateway) {}

  // US-19: cambio de estado de un ticket
  estadoCambiado(
    ticket: TicketNotificable,
    estadoAnterior: EstadoTicket,
    estadoNuevo: EstadoTicket,
    autorId: number,
  ) {
    this.notificar(this.destinatarios(ticket, autorId), 'ticket.estado_cambiado', {
      ticketId: ticket.id,
      titulo: ticket.titulo,
      estadoAnterior,
      estadoNuevo,
      fecha: new Date().toISOString(),
    });
  }

  // US-20: comentario nuevo en un ticket
  nuevoComentario(
    ticket: TicketNotificable,
    comentario: { id: number; contenido: string; autor: { id: number; nombre: string } },
  ) {
    this.notificar(this.destinatarios(ticket, comentario.autor.id), 'ticket.nuevo_comentario', {
      ticketId: ticket.id,
      titulo: ticket.titulo,
      comentarioId: comentario.id,
      contenido: comentario.contenido,
      autor: comentario.autor.nombre,
      fecha: new Date().toISOString(),
    });
  }

  // A quién le importa: el creador y el agente asignado, menos quien hizo la acción
  private destinatarios(ticket: TicketNotificable, autorId: number): number[] {
    const ids = [ticket.creadorId, ticket.agenteId].filter(
      (id): id is number => id !== null && id !== autorId,
    );
    return [...new Set(ids)];
  }

  // Nunca lanza error: si falla un aviso, la operación principal sigue igual
  private notificar(usuarioIds: number[], evento: string, datos: object) {
    for (const usuarioId of usuarioIds) {
      try {
        this.gateway.enviarA(usuarioId, evento, datos);
      } catch (error) {
        this.logger.warn(
          `No se pudo notificar al usuario ${usuarioId}: ${(error as Error).message}`,
        );
      }
    }
  }
}
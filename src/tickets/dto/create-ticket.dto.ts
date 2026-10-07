
import { Type } from 'class-transformer';
import { EstadoTicket, Prioridad } from '../../generated/prisma/enums.js';

export class CreateTicketDto {
    titulo: string;
    descripcion: string;
    estado: EstadoTicket;
    prioridad: Prioridad;
    creadorId: number;
    agenteId?: number;
    categoriaId: number;

}
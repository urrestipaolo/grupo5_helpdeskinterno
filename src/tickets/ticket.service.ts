import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTicketDto } from "./dto/create-ticket.dto.js";
import { UpdateTicketDto } from "./dto/update-ticket.dto.js";
import { PrismaService } from "../prisma/prisma.service.js";
import type { UsuarioActualPayload } from "../comentarios/comentarios.service.js";
import { EstadoTicket } from "../generated/prisma/client.js";
import { Prisma } from "../generated/prisma/client.js";


@Injectable()
export class TicketService {
    constructor (
        private readonly prisma: PrismaService
    ) {}

    // Valida que el usuario exista, esté activo y tenga rol AGENTE
    private async validarAgente(agenteId: number) {
        const agente = await this.prisma.usuario.findUnique({
            where: { id: agenteId },
        });
        if (!agente) {
            throw new BadRequestException(`El usuario con ID ${agenteId} no existe`);
        }
        if (agente.rol !== 'AGENTE') {
            throw new BadRequestException('Solo se puede asignar un ticket a un usuario con rol AGENTE');
        }
        if (!agente.activo) {
            throw new BadRequestException('El agente está inactivo');
        }
    }

    // Solo el ADMIN puede asignar agentes
    private async validarAsignacion(agenteId: number | undefined, usuario: UsuarioActualPayload) {
        if (agenteId === undefined) return;
        if (usuario.rol !== 'ADMIN') {
            throw new ForbiddenException('Solo un usuario con rol ADMIN puede asignar un ticket a un agente');
        }
        await this.validarAgente(agenteId);
    }


    // Qué tickets puede ver cada rol
    private filtroAcceso(usuario: UsuarioActualPayload): Prisma.TicketWhereInput {
        // ADMIN y AGENTE ven todos los tickets
        if (usuario.rol === 'ADMIN' || usuario.rol === 'AGENTE') {
            return {};
        }
        // EMPLEADO solo ve los que creó
        return { creadorId: usuario.id };
    }


    // Valida que la categoría exista
    private async validarCategoria(categoriaId: number) {
        const categoriax = await this.prisma.categoria.findUnique({
            where: { id: categoriaId },
        });
        if (!categoriax) {
            throw new BadRequestException(`La categoría con ID ${categoriaId} no existe`);
        }
    }

    //CREAR
    async create(createTicketDto: CreateTicketDto, usuario: UsuarioActualPayload) {
        await this.validarAsignacion(createTicketDto.agenteId, usuario);
        await this.validarCategoria(createTicketDto.categoriaId);
        return await this.prisma.ticket.create({
            data: {...createTicketDto, creadorId: usuario.id},
        });
    }

    //BUSCAR TODOS
    async findAll(usuario: UsuarioActualPayload) {
        return this.prisma.ticket.findMany({
            where: this.filtroAcceso(usuario),
            orderBy: { id: 'asc'},
        });
    }

    //ENCONTRAR UN TICKET POR ID
    async findOne(id: number, usuario: UsuarioActualPayload){
        const ticketx = await this.prisma.ticket.findFirst({
            where: {id, ...this.filtroAcceso(usuario)},
        });
        if (!ticketx){
            throw new NotFoundException('No se ha encontrado el ID del ticket')
        }
        return ticketx;
    }

    //ACTUALIZAR UN TICKET POR SU ID
    async update(id: number, updateTicketDto: UpdateTicketDto, usuario: UsuarioActualPayload){
        const ticketx = await this.findOne(id, usuario);
        await this.validarAsignacion(updateTicketDto.agenteId, usuario)

        if (updateTicketDto.categoriaId !== undefined){
            await this.validarCategoria(updateTicketDto.categoriaId);
        }

        if (updateTicketDto.estado !== undefined){
            if (ticketx.estado === EstadoTicket.CERRADO && updateTicketDto.estado !== undefined && updateTicketDto.estado !== EstadoTicket.CERRADO)
            {
                throw new BadRequestException('Este ticket ha sido CERRADO, no puede volver a ABIERTO')
            }
        }

        return await this.prisma.ticket.update({
            where: {id},
            data: updateTicketDto,
        });
    }

    //ELIMINAR UN TICKET POR SU ID
    async remove(id: number, usuario: UsuarioActualPayload) {
    if (usuario.rol !== 'ADMIN') {
        throw new ForbiddenException('Solo el usuario de rol ADMIN puede eliminar un ticket');
    }
    await this.findOne(id, usuario);
    return await this.prisma.ticket.delete({
        where: { id },
    });
}
}
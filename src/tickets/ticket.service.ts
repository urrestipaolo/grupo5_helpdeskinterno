import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTicketDto } from "./dto/create-ticket.dto.js";
import { UpdateTicketDto } from "./dto/update-ticket.dto.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { Prisma } from "../generated/prisma/client.js";

@Injectable()
export class TicketService {
    constructor (
        private readonly prisma: PrismaService
    ) {}

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
    async create(createTicketDto: CreateTicketDto) {
        await this.validarCategoria(createTicketDto.categoriaId)
        return await this.prisma.ticket.create({
            data: createTicketDto,
        });
    }

    //BUSCAR TODOS
    async findAll() {
        return this.prisma.ticket.findMany({
            orderBy: { id: 'asc'},
        });
    }

    //ENCONTRAR UN TICKET POR ID
    async findOne(id: number){
        const ticketx = await this.prisma.ticket.findUnique({
            where: {id},
        });
        if (!ticketx){
            throw new NotFoundException('No se ha encontrado el ID del ticket')
        }
        return ticketx;
    }

    //ACTUALIZAR UN TICKET POR SU ID
    async update(id: number, updateTicketDto: UpdateTicketDto){
        if (updateTicketDto.categoriaId !== undefined){
            await this.validarCategoria(updateTicketDto.categoriaId)
        }
        return await this.prisma.ticket.update({
            where: {id},
            data: updateTicketDto,
        });
    }

    //ELIMINAR UN TICKET POR SU ID
    async remove(id: number){
        const tickets = await this.prisma.ticket.findUnique({
            where: {id},
        });
        if (!tickets){
            throw new NotFoundException('No se ha encontrado el ID del ticket para eliminar')
        }
        return await this.prisma.ticket.delete({
            where: {id},
        });
    }
}
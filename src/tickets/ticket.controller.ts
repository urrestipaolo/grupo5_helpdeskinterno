import { TicketService } from "./ticket.service.js";
import { CreateTicketDto } from "./dto/create-ticket.dto.js";
import { UpdateTicketDto } from "./dto/update-ticket.dto.js";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard, type UsuarioActualPayload } from "../auth/guards/jwt-auth.guard.js";
import { UsuarioActual } from "../auth/decorators/usuario-actual.decorator.js";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@UseGuards(JwtAuthGuard)
@ApiResponse({
    status: 401,
    description: 'No está autorizado, inicie sesión'
})
@Controller('tickets')
export class TicketController{
    constructor( private readonly ticketService: TicketService){}

    //GET MOSTRAR TODOS LOS TICKETS
    @Get()
    @ApiOperation({ summary: 'Ver una lista de todos tus tickets'})
    @ApiResponse({
        status: 200,
        description: 'Lista desplegada con exito'
    })
    findAll(@UsuarioActual() usuario: UsuarioActualPayload){
        return this.ticketService.findAll(usuario);
    }

    //GET ID | ENCONTRAR UN TICKET POR SU ID
    @Get(':id')
    @ApiOperation({ summary: 'Encontrar tu ticket por su ID'})
    @ApiResponse({
        status: 200,
        description: 'Ticket encontrado y mostrando'
    })
    @ApiResponse({
        status: 404,
        description: 'Ticket no encontrado',
    })
    findOne(@Param('id', ParseIntPipe) id:string, @UsuarioActual() usuario: UsuarioActualPayload){
        return this.ticketService.findOne(+id, usuario);
    }

    //POST CREAR UN TICKET
    @Post()
    @ApiOperation({ summary: 'Crear un ticket'})
    @ApiResponse({
        status: 201,
        description: 'Ticket creado con exito'
    })
    @ApiResponse({
        status: 400,
        description: 'Error al crear el ticket, mal formato'
    })
    create(@Body() createTicketDto: CreateTicketDto, @UsuarioActual() usuario: UsuarioActualPayload){
        return this.ticketService.create(createTicketDto, usuario);
    }

    //PATCH ACTUALIZAR UN TICKET POR SU ID
    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar ticket por su ID'})
    @ApiResponse({
        status: 200,
        description: 'Ticket actualizado con exito'
    })
    update(@Param('id') id: string, @Body() updateTicketDto:UpdateTicketDto, @UsuarioActual() usuario: UsuarioActualPayload){
        return this.ticketService.update(+id, updateTicketDto, usuario);
    }

    //DELETE ELIMINAR UN TICKET POR SU ID
    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un ticket por su ID'})
    remove(@Param('id') id:string, @UsuarioActual() usuario: UsuarioActualPayload){
        return this.ticketService.remove(+id, usuario);
    }

}

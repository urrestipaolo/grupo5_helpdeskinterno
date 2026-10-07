import { TicketService } from "./ticket.service.js";
import { CreateTicketDto } from "./dto/create-ticket.dto.js";
import { UpdateTicketDto } from "./dto/update-ticket.dto.js";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('tickets')
export class TicketController{
    constructor( private readonly ticketService: TicketService){}

    //GET MOSTRAR TODOS LOS TICKETS
    @Get()
    @ApiOperation({ summary: 'Trae una lista de todos tus tickets'})
    @ApiResponse({ status: 200 , description: 'Lista entregada con exito'})
    findAll(){
        return this.ticketService.findAll();
    }

    //GET ID | ENCONTRAR UN TICKET POR SU ID
    @Get(':id')
    findOne(@Param('id') id:string){
        return this.ticketService.findOne(+id);
    }

    //POST CREAR UN TICKET
    @Post()
    create(@Body() createTicketDto: CreateTicketDto){
        return this.ticketService.create(createTicketDto);
    }

    //PATCH ACTUALIZAR UN TICKET POR SU ID
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTicketDto:UpdateTicketDto){
        return this.ticketService.update(+id, updateTicketDto);
    }
    
    //DELETE ELIMINAR UN TICKET POR SU ID
    @Delete(':id')
    remove(@Param('id') id:string){
        return this.ticketService.remove(+id);
    }

}

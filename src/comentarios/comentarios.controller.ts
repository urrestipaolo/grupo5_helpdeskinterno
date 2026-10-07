import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ComentariosService } from './comentarios.service.js';
import type { UsuarioActualPayload } from './comentarios.service.js';
import { CreateComentarioDto } from './dto/create-comentario.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UsuarioActual } from '../auth/decorators/usuario-actual.decorator.js';

@ApiTags('Comentarios')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('tickets/:ticketId/comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  @ApiOperation({ summary: 'Agregar un comentario a un ticket' })
  @ApiResponse({ status: 201, description: 'Comentario creado' })
  @ApiResponse({ status: 404, description: 'El ticket no existe o no es visible para el usuario' })
  crear(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @UsuarioActual() usuario: UsuarioActualPayload,
    @Body() dto: CreateComentarioDto,
  ) {
    return this.comentariosService.crear(ticketId, usuario, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Historial de comentarios de un ticket, en orden cronológico' })
  listar(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @UsuarioActual() usuario: UsuarioActualPayload,
  ) {
    return this.comentariosService.listar(ticketId, usuario);
  }
}
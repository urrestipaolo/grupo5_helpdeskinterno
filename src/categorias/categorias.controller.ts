import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CategoriasService } from './categorias.service.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Rol } from '../generated/prisma/enums.js';

@ApiTags('Categorías')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar categorías' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  listar() {
    return this.categoriasService.listar();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar categoría por ID' })
  @ApiResponse({
    status: 200,
    description: 'Categoría encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
  })
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.buscarPorId(id);
  }

  @Post()
  @Roles(Rol.ADMIN, Rol.AGENTE)
  @ApiOperation({ summary: 'Crear categoría' })
  @ApiResponse({
    status: 201,
    description: 'Categoría creada',
  })
  @ApiResponse({
    status: 403,
    description: 'Permisos insuficientes',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una categoría con ese nombre',
  })
  crear(@Body() dto: CreateCategoriaDto) {
    return this.categoriasService.crear(dto);
  }

  @Patch(':id')
  @Roles(Rol.ADMIN, Rol.AGENTE)
  @ApiOperation({ summary: 'Actualizar categoría' })
  @ApiResponse({
    status: 200,
    description: 'Categoría actualizada',
  })
  @ApiResponse({
    status: 403,
    description: 'Permisos insuficientes',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una categoría con ese nombre',
  })
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.actualizar(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMIN, Rol.AGENTE)
  @ApiOperation({ summary: 'Eliminar categoría' })
  @ApiResponse({
    status: 200,
    description: 'Categoría eliminada',
  })
  @ApiResponse({
    status: 403,
    description: 'Permisos insuficientes',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'La categoría tiene tickets asociados',
  })
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.eliminar(id);
  }
}
